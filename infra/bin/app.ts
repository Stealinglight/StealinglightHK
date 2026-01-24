#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AmplifyHostingStack } from '../lib/amplify-hosting-stack';
import { ContactStack } from '../lib/contact-stack';
import { TagComplianceAspect } from '../lib/aspects/tag-compliance-aspect';

const app = new cdk.App();

// Get context values
const appName = app.node.tryGetContext('appName') || 'stealinglight';
const repositoryOwner = app.node.tryGetContext('repositoryOwner') || 'Stealinglight';
const repositoryName = app.node.tryGetContext('repositoryName') || 'stealinglightHK';
const branch = app.node.tryGetContext('branch') || 'main';
const environment = app.node.tryGetContext('environment') || 'production';

// Contact email from environment variable
const contactEmail = process.env.CONTACT_EMAIL;
if (!contactEmail) {
  console.warn('Warning: CONTACT_EMAIL environment variable not set. Contact form will not work.');
}

// Common stack props
const stackProps: cdk.StackProps = {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-west-2',
  },
};

// Create Amplify Hosting Stack
const amplifyStack = new AmplifyHostingStack(app, `${appName}-amplify`, {
  ...stackProps,
  appName,
  repositoryOwner,
  repositoryName,
  branch,
  environment,
});

// Create Contact Form Stack
const contactStack = new ContactStack(app, `${appName}-contact`, {
  ...stackProps,
  appName,
  contactEmail: contactEmail || 'noreply@example.com',
  environment,
  // Add Amplify default domain to allowed origins after first deployment
  // allowedOrigins: ['http://localhost:5173', 'https://stealinglight.hk', 'https://main.xxx.amplifyapp.com'],
});

// Apply tag compliance to all stacks
const requiredTags = {
  Project: appName,
  Environment: environment,
  ManagedBy: 'CDK',
  Repository: `${repositoryOwner}/${repositoryName}`,
};

cdk.Aspects.of(amplifyStack).add(new TagComplianceAspect(requiredTags));
cdk.Aspects.of(contactStack).add(new TagComplianceAspect(requiredTags));
