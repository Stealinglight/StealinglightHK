import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { Construct } from 'constructs';

export interface ContactStackProps extends cdk.StackProps {
  appName: string;
  contactEmail: string;
  environment: string;
  allowedOrigins?: string[];
}

export class ContactStack extends cdk.Stack {
  public readonly apiUrl: string;

  constructor(scope: Construct, id: string, props: ContactStackProps) {
    super(scope, id, props);

    // Default allowed origins - no wildcards (API Gateway doesn't support them)
    // Add specific Amplify domains after deployment
    const allowedOrigins = props.allowedOrigins ?? [
      'http://localhost:5173',
      'http://localhost:3000',
      `https://${props.appName}.hk`,
      `https://www.${props.appName}.hk`,
    ];

    // Log group for Lambda function
    const logGroup = new logs.LogGroup(this, 'ContactFunctionLogGroup', {
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Lambda function for contact form
    const contactFunction = new lambda.Function(this, 'ContactFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      logGroup,
      code: lambda.Code.fromInline(`
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const ses = new SESClient({ region: process.env.AWS_REGION });
const CONTACT_EMAIL = process.env.CONTACT_EMAIL;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS.split(',');

// In-memory rate limiter (resets on cold start, but free)
const requestCounts = new Map();
const RATE_LIMIT = 3; // max requests per IP per window
const WINDOW_MS = 60000; // 1 minute window

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = requestCounts.get(ip);

  if (!entry || now - entry.timestamp > WINDOW_MS) {
    requestCounts.set(ip, { count: 1, timestamp: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT) {
    return false;
  }
  entry.count++;
  return true;
}

// Sanitize user input to prevent HTML injection
const escapeHtml = (str) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

exports.handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || '';
  const isAllowedOrigin = origin && ALLOWED_ORIGINS.includes(origin);
  const sourceIp = event.requestContext?.identity?.sourceIp || 'unknown';

  const baseHeaders = {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (!isAllowedOrigin) {
    return {
      statusCode: 403,
      headers: baseHeaders,
      body: JSON.stringify({ error: 'CORS origin not allowed' }),
    };
  }

  const headers = {
    ...baseHeaders,
    'Access-Control-Allow-Origin': origin,
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Check rate limit
  if (!checkRateLimit(sourceIp)) {
    console.log(JSON.stringify({
      event: 'rate_limit_exceeded',
      sourceIp,
      timestamp: new Date().toISOString(),
    }));
    return {
      statusCode: 429,
      headers,
      body: JSON.stringify({ error: 'Too many requests. Please try again later.' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { name, email, message, subject } = body;

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: name, email, message' }),
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email format' }),
      };
    }
    const MAX_NAME_LENGTH = 200;
    const MAX_SUBJECT_LENGTH = 200;
    const MAX_MESSAGE_LENGTH = 5000;

    const lengthErrors = [];
    if (name.length > MAX_NAME_LENGTH) lengthErrors.push(\`name (max \${MAX_NAME_LENGTH} chars)\`);
    if (message.length > MAX_MESSAGE_LENGTH) lengthErrors.push(\`message (max \${MAX_MESSAGE_LENGTH} chars)\`);
    if (subject && subject.length > MAX_SUBJECT_LENGTH) lengthErrors.push(\`subject (max \${MAX_SUBJECT_LENGTH} chars)\`);
    if (lengthErrors.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: \`Field(s) exceed maximum length: \${lengthErrors.join(', ')}\` }),
      };
    }
    // Sanitize inputs for email subject and HTML body
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);
    const safeSubject = subject ? escapeHtml(subject) : null;

    const emailSubject = safeSubject || \`Contact Form: \${safeName}\`;

    await ses.send(new SendEmailCommand({
      Source: CONTACT_EMAIL,
      Destination: { ToAddresses: [CONTACT_EMAIL] },
      ReplyToAddresses: [email],
      Message: {
        Subject: { Data: emailSubject },
        Body: {
          Text: {
            Data: \`Name: \${name}\\nEmail: \${email}\\n\\nMessage:\\n\${message}\`,
          },
          Html: {
            Data: \`
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> \${safeName}</p>
              <p><strong>Email:</strong> <a href="mailto:\${safeEmail}">\${safeEmail}</a></p>
              <h3>Message:</h3>
              <p>\${safeMessage.replace(/\\n/g, '<br>')}</p>
            \`,
          },
        },
      },
    }));

    // Log successful submission for monitoring
    console.log(JSON.stringify({
      event: 'contact_form_submission',
      sourceIp,
      replyToEmail: email,
      timestamp: new Date().toISOString(),
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Message sent successfully' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to send message' }),
    };
  }
};
      `),
      environment: {
        CONTACT_EMAIL: props.contactEmail,
        ALLOWED_ORIGINS: allowedOrigins.join(','),
      },
      timeout: cdk.Duration.seconds(15),
      memorySize: 256,
      description: 'Contact form handler for stealinglight.hk',
    });

    // Grant SES permissions scoped to verified identities
    contactFunction.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['ses:SendEmail', 'ses:SendRawEmail'],
        resources: [
          `arn:aws:ses:${this.region}:${this.account}:identity/${props.contactEmail}`,
          `arn:aws:ses:${this.region}:${this.account}:identity/${props.appName}.hk`,
        ],
      })
    );

    // API Gateway REST API
    const api = new apigateway.RestApi(this, 'ContactApi', {
      restApiName: `${props.appName}-contact-api`,
      description: 'Contact form API for stealinglight.hk',
      defaultCorsPreflightOptions: {
        allowOrigins: allowedOrigins,
        allowMethods: ['POST', 'OPTIONS'],
        allowHeaders: ['Content-Type'],
      },
      deployOptions: {
        stageName: props.environment,
        throttlingRateLimit: 10,
        throttlingBurstLimit: 20,
      },
    });

    // Add /contact resource
    const contactResource = api.root.addResource('contact');
    contactResource.addMethod('POST', new apigateway.LambdaIntegration(contactFunction));

    this.apiUrl = api.url;

    // CloudWatch Alarms for monitoring
    // Lambda error alarm - triggers if errors occur
    new cloudwatch.Alarm(this, 'LambdaErrorAlarm', {
      alarmName: `${props.appName}-contact-lambda-errors`,
      alarmDescription: 'Contact form Lambda function errors',
      metric: contactFunction.metricErrors({
        period: cdk.Duration.minutes(5),
        statistic: 'Sum',
      }),
      threshold: 5,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    // API Gateway 5xx alarm - server errors
    new cloudwatch.Alarm(this, 'ApiGateway5xxAlarm', {
      alarmName: `${props.appName}-contact-api-5xx`,
      alarmDescription: 'Contact form API 5xx errors',
      metric: api.metricServerError({
        period: cdk.Duration.minutes(5),
        statistic: 'Sum',
      }),
      threshold: 5,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    // API Gateway 4xx alarm - client errors (high threshold for abuse detection)
    new cloudwatch.Alarm(this, 'ApiGateway4xxAlarm', {
      alarmName: `${props.appName}-contact-api-4xx`,
      alarmDescription: 'Contact form API 4xx errors (possible abuse)',
      metric: api.metricClientError({
        period: cdk.Duration.minutes(5),
        statistic: 'Sum',
      }),
      threshold: 50,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    // Outputs
    new cdk.CfnOutput(this, 'ContactApiUrl', {
      value: api.url,
      description: 'Contact form API URL',
      exportName: `${props.appName}-contact-api-url`,
    });

    new cdk.CfnOutput(this, 'ContactEndpoint', {
      value: `${api.url}contact`,
      description: 'Contact form endpoint (POST)',
      exportName: `${props.appName}-contact-endpoint`,
    });
  }
}
