import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as ses from 'aws-cdk-lib/aws-ses';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import * as path from 'path';

export interface ApiStackProps extends cdk.StackProps {
  domainName: string;
  contactEmail: string;
}

export class ApiStack extends cdk.Stack {
  public readonly apiEndpoint: string;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const { domainName, contactEmail } = props;

    // Create Lambda function for contact form
    const contactFormFunction = new lambdaNodejs.NodejsFunction(
      this,
      'ContactFormFunction',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'handler',
        entry: path.join(__dirname, '../src/lambda/contact-form/index.ts'),
        timeout: cdk.Duration.seconds(10),
        memorySize: 256,
        architecture: lambda.Architecture.ARM_64,
        environment: {
          CONTACT_EMAIL: contactEmail,
          FROM_EMAIL: `noreply@${domainName}`,
          AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        },
        bundling: {
          minify: true,
          sourceMap: true,
          target: 'node20',
          externalModules: [], // Bundle all dependencies
        },
        logRetention: logs.RetentionDays.ONE_MONTH,
        description: 'Contact form handler - processes submissions and sends emails via SES',
      }
    );

    // Grant SES send email permissions
    contactFormFunction.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ses:SendEmail', 'ses:SendRawEmail'],
        resources: ['*'],
        conditions: {
          StringEquals: {
            'ses:FromAddress': `noreply@${domainName}`,
          },
        },
      })
    );

    // Create API Gateway REST API
    const api = new apigateway.RestApi(this, 'ContactApi', {
      restApiName: 'StealingLight Contact API',
      description: 'API for contact form submissions',
      deployOptions: {
        stageName: 'v1',
        throttlingRateLimit: 10,
        throttlingBurstLimit: 20,
        loggingLevel: apigateway.MethodLoggingLevel.ERROR,
        metricsEnabled: true,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: [
          `https://${domainName}`,
          `https://www.${domainName}`,
          `https://creative.${domainName}`,
          `https://security.${domainName}`,
          // Allow localhost for development
          'http://localhost:5173',
          'http://localhost:5174',
          'http://localhost:5175',
        ],
        allowMethods: ['POST', 'OPTIONS'],
        allowHeaders: ['Content-Type'],
        maxAge: cdk.Duration.hours(1),
      },
    });

    // Add /contact resource
    const contactResource = api.root.addResource('contact');

    // Add POST method for contact form
    contactResource.addMethod(
      'POST',
      new apigateway.LambdaIntegration(contactFormFunction, {
        requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
      }),
      {
        methodResponses: [
          {
            statusCode: '200',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Origin': true,
            },
          },
          {
            statusCode: '400',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Origin': true,
            },
          },
          {
            statusCode: '500',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Origin': true,
            },
          },
        ],
      }
    );

    // Store API endpoint
    this.apiEndpoint = api.url;

    // Outputs
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
      description: 'API Gateway endpoint URL',
      exportName: 'api-endpoint',
    });

    new cdk.CfnOutput(this, 'ContactEndpoint', {
      value: `${api.url}contact`,
      description: 'Contact form endpoint URL',
      exportName: 'contact-endpoint',
    });

    new cdk.CfnOutput(this, 'LambdaFunctionName', {
      value: contactFormFunction.functionName,
      description: 'Contact form Lambda function name',
    });

    new cdk.CfnOutput(this, 'LambdaFunctionArn', {
      value: contactFormFunction.functionArn,
      description: 'Contact form Lambda function ARN',
    });
  }
}
