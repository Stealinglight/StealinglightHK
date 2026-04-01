import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as actions from 'aws-cdk-lib/aws-cloudwatch-actions';
import { Construct } from 'constructs';
import * as path from 'path';

export interface ContactStackProps extends cdk.StackProps {
  appName: string;
  contactEmail: string;
  environment: string;
  allowedOrigins?: string[];
  notificationEmail?: string;
  turnstileSecret?: string;
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
    // Handler code extracted to lambda/contact/index.js for testability and maintainability
    // Rate limiting handled by API Gateway (throttlingRateLimit/throttlingBurstLimit in deployOptions)
    const contactFunction = new lambda.Function(this, 'ContactFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      logGroup,
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/contact')),
      environment: {
        CONTACT_EMAIL: props.contactEmail,
        ALLOWED_ORIGINS: allowedOrigins.join(','),
        TURNSTILE_SECRET: props.turnstileSecret || '',
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
    const lambdaErrorAlarm = new cloudwatch.Alarm(this, 'LambdaErrorAlarm', {
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
    const api5xxAlarm = new cloudwatch.Alarm(this, 'ApiGateway5xxAlarm', {
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
    const api4xxAlarm = new cloudwatch.Alarm(this, 'ApiGateway4xxAlarm', {
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

    // SNS topic for alarm notifications (D-12: single topic for all alarms)
    const alarmTopic = new sns.Topic(this, 'AlarmNotifications', {
      topicName: `${props.appName}-alarm-notifications`,
      displayName: `${props.appName} Alarm Notifications`,
    });

    // D-13: Email subscription (requires confirmation click after deploy)
    if (props.notificationEmail) {
      alarmTopic.addSubscription(new subscriptions.EmailSubscription(props.notificationEmail));
    }

    // Wire all existing alarms to SNS (D-14: thresholds unchanged)
    lambdaErrorAlarm.addAlarmAction(new actions.SnsAction(alarmTopic));
    api5xxAlarm.addAlarmAction(new actions.SnsAction(alarmTopic));
    api4xxAlarm.addAlarmAction(new actions.SnsAction(alarmTopic));

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
