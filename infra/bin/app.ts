#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AmplifyHostingStack } from '../lib/amplify-hosting-stack';
import { ContactStack } from '../lib/contact-stack';
import { MediaStack } from '../lib/media-stack';
import { GithubOidcStack } from '../lib/github-oidc-stack';
import { TagComplianceAspect } from '../lib/aspects/tag-compliance-aspect';

const app = new cdk.App();

// Get context values
const appName = app.node.tryGetContext('appName') || 'stealinglight';
const repositoryOwner = app.node.tryGetContext('repositoryOwner') || 'Stealinglight';
const repositoryName = app.node.tryGetContext('repositoryName') || 'StealinglightHK';
const branch = app.node.tryGetContext('branch') || 'main';
const environment = app.node.tryGetContext('environment') || 'production';
const domainName = app.node.tryGetContext('domainName');

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

// Create Media Stack (independent - can be deployed first)
const mediaStack = new MediaStack(app, `${appName}-media`, {
  ...stackProps,
  appName,
  environment,
});

// Create Contact Form Stack first (Amplify depends on its API URL)
const contactStack = new ContactStack(app, `${appName}-contact`, {
  ...stackProps,
  appName,
  contactEmail: contactEmail || 'noreply@example.com',
  environment,
  // Add Amplify default domain to allowed origins after first deployment
  // allowedOrigins: ['http://localhost:5173', 'https://stealinglight.hk', 'https://main.xxx.amplifyapp.com'],
});

// Create Amplify Hosting Stack with contact API URL
const amplifyStack = new AmplifyHostingStack(app, `${appName}-amplify`, {
  ...stackProps,
  appName,
  repositoryOwner,
  repositoryName,
  branch,
  environment,
  contactApiUrl: `${contactStack.apiUrl}contact`,
  domainName,
});

// Ensure Amplify stack deploys after ContactStack
amplifyStack.addDependency(contactStack);

// Apply tag compliance to all stacks
const requiredTags = {
  Project: appName,
  Environment: environment,
  ManagedBy: 'CDK',
  Repository: `${repositoryOwner}/${repositoryName}`,
};

cdk.Aspects.of(amplifyStack).add(new TagComplianceAspect(requiredTags));
cdk.Aspects.of(contactStack).add(new TagComplianceAspect(requiredTags));
cdk.Aspects.of(mediaStack).add(new TagComplianceAspect(requiredTags));

// Create GitHub OIDC Stack for CI/CD authentication
// This stack is independent and should be deployed first (manually) to bootstrap CI/CD
// Note: If the GitHub OIDC provider already exists in the account, pass its ARN
const existingOidcProviderArn = app.node.tryGetContext('existingOidcProviderArn');
const githubOidcStack = new GithubOidcStack(app, `${appName}-github-oidc`, {
  ...stackProps,
  repositoryOwner,
  repositoryName,
  allowedBranches: ['main'],
  allowPullRequests: false, // Security: only allow deployments from main branch
  existingOidcProviderArn,
});
cdk.Aspects.of(githubOidcStack).add(new TagComplianceAspect(requiredTags));
