import * as cdk from 'aws-cdk-lib';
import * as amplify from 'aws-cdk-lib/aws-amplify';
import { Construct } from 'constructs';

export interface AmplifyHostingStackProps extends cdk.StackProps {
  appName: string;
  repositoryOwner: string;
  repositoryName: string;
  branch: string;
  environment: string;
  contactApiUrl?: string;
}

export class AmplifyHostingStack extends cdk.Stack {
  public readonly app: amplify.CfnApp;
  public readonly defaultDomain: string;

  constructor(scope: Construct, id: string, props: AmplifyHostingStackProps) {
    super(scope, id, props);

    // Create Amplify App
    // Note: GitHub connection must be done via Amplify Console after deployment
    this.app = new amplify.CfnApp(this, 'AmplifyApp', {
      name: props.appName,
      platform: 'WEB',
      
      // Build specification using npm (Amplify default)
      // NOTE: Intentionally using npm for Amplify builds for reliability.
      // Bun is used for local development. Both use the same package.json
      // and produce identical builds. npm ci ensures reproducible builds
      // on Amplify's infrastructure.
      // --legacy-peer-deps needed for React 19 compatibility with some packages
      buildSpec: `
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci --legacy-peer-deps
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
`,

      // Environment variables
      environmentVariables: [
        {
          name: 'VITE_CONTACT_API_URL',
          value: props.contactApiUrl || '', // Populated via cross-stack reference
        },
      ],

      // SPA rewrite rules for React Router
      // First rule: Regex matches paths without extensions OR paths with extensions
      // that are NOT static assets (css, js, images, fonts, etc). These get rewritten
      // to index.html to enable client-side routing.
      customRules: [
        {
          source: '/^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|webp|mp4|webm)$)([^.]+$)/',
          target: '/index.html',
          status: '200',
        },
        {
          source: '/<*>',
          target: '/index.html',
          status: '404-200',
        },
      ],

      // Tags
      tags: [
        { key: 'Project', value: props.appName },
        { key: 'Environment', value: props.environment },
        { key: 'ManagedBy', value: 'CDK' },
        { key: 'Repository', value: `${props.repositoryOwner}/${props.repositoryName}` },
      ],
    });

    // Construct the default domain
    this.defaultDomain = `main.${this.app.attrDefaultDomain}`;

    // Outputs
    new cdk.CfnOutput(this, 'AmplifyAppId', {
      value: this.app.attrAppId,
      description: 'Amplify App ID',
      exportName: `${props.appName}-amplify-app-id`,
    });

    new cdk.CfnOutput(this, 'AmplifyDefaultDomain', {
      value: this.defaultDomain,
      description: 'Amplify default domain (connect GitHub via Console to activate)',
      exportName: `${props.appName}-amplify-default-domain`,
    });

    new cdk.CfnOutput(this, 'AmplifyConsoleUrl', {
      value: `https://${this.region}.console.aws.amazon.com/amplify/home?region=${this.region}#/${this.app.attrAppId}`,
      description: 'Amplify Console URL - connect GitHub repository here',
    });
  }
}
