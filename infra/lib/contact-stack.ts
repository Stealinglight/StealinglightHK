import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigatewayIntegrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import * as path from 'path';

interface ContactFormStackProps extends cdk.StackProps {
  fromEmail: string;
  toEmail: string;
  allowedOrigins: string[];
}

export class ContactFormStack extends cdk.Stack {
  public readonly apiUrl: string;

  constructor(scope: Construct, id: string, props: ContactFormStackProps) {
    super(scope, id, props);

    // Lambda function for handling contact form submissions
    const contactHandler = new lambda.Function(this, 'ContactHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/contact'), {
        bundling: {
          image: lambda.Runtime.NODEJS_20_X.bundlingImage,
          command: [
            'bash',
            '-c',
            'npm install && npm run build && cp -r dist/* /asset-output/',
          ],
          local: {
            tryBundle(outputDir: string) {
              const esbuild = require('esbuild');
              esbuild.buildSync({
                entryPoints: [path.join(__dirname, '../lambda/contact/index.ts')],
                bundle: true,
                platform: 'node',
                target: 'node20',
                outfile: path.join(outputDir, 'index.js'),
              });
              return true;
            },
          },
        },
      }),
      environment: {
        FROM_EMAIL: props.fromEmail,
        TO_EMAIL: props.toEmail,
        ALLOWED_ORIGINS: props.allowedOrigins.join(','),
      },
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      logRetention: logs.RetentionDays.ONE_WEEK,
    });

    // Grant SES send email permission
    contactHandler.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ses:SendEmail', 'ses:SendRawEmail'],
        resources: ['*'], // Scoped by SES identity policies
      })
    );

    // HTTP API Gateway
    const httpApi = new apigateway.HttpApi(this, 'ContactApi', {
      apiName: 'stealinglight-contact-api',
      corsPreflight: {
        allowHeaders: ['Content-Type'],
        allowMethods: [apigateway.CorsHttpMethod.POST, apigateway.CorsHttpMethod.OPTIONS],
        allowOrigins: props.allowedOrigins,
        maxAge: cdk.Duration.hours(1),
      },
    });

    // Add POST /contact route
    httpApi.addRoutes({
      path: '/contact',
      methods: [apigateway.HttpMethod.POST],
      integration: new apigatewayIntegrations.HttpLambdaIntegration(
        'ContactIntegration',
        contactHandler
      ),
    });

    this.apiUrl = httpApi.url!;

    // Outputs
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: httpApi.url!,
      description: 'Contact form API endpoint',
    });

    new cdk.CfnOutput(this, 'ContactEndpoint', {
      value: `${httpApi.url}contact`,
      description: 'Full contact form endpoint URL',
    });
  }
}
