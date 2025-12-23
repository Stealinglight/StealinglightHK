#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { StaticSiteStack } from '../lib/static-site-stack';
import { ApiStack } from '../lib/api-stack';

const app = new cdk.App();

// Environment configuration
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT || '383579119744',
  region: process.env.CDK_DEFAULT_REGION || 'us-west-2',
};

// Certificate must be in us-east-1 for CloudFront
const usEast1Env = {
  account: env.account,
  region: 'us-east-1',
};

// Domain configuration
const domainName = 'stealinglight.hk';
const contactEmail = process.env.CONTACT_EMAIL || 'contact@stealinglight.hk';

// API Stack (Lambda + API Gateway + SES) - deployed first
const apiStack = new ApiStack(app, 'StealingLightApiStack', {
  env,
  domainName,
  contactEmail,
  description: 'StealingLight API (Contact Form Lambda + API Gateway)',
});

// Hub Site Stack (apex + www)
const hubStack = new StaticSiteStack(app, 'StealingLightHubStack', {
  env,
  siteName: 'hub',
  domainName,
  subdomains: ['www'], // www.stealinglight.hk redirects to apex
  isApex: true,
  apiEndpoint: apiStack.apiEndpoint,
  description: 'StealingLight Hub Site (stealinglight.hk)',
});

// Creative Site Stack
const creativeStack = new StaticSiteStack(app, 'StealingLightCreativeStack', {
  env,
  siteName: 'creative',
  domainName,
  subdomains: ['creative'], // creative.stealinglight.hk
  isApex: false,
  apiEndpoint: apiStack.apiEndpoint,
  description: 'StealingLight Creative Site (creative.stealinglight.hk)',
});

// Security Site Stack
const securityStack = new StaticSiteStack(app, 'StealingLightSecurityStack', {
  env,
  siteName: 'security',
  domainName,
  subdomains: ['security'], // security.stealinglight.hk
  isApex: false,
  apiEndpoint: apiStack.apiEndpoint,
  description: 'StealingLight Security Site (security.stealinglight.hk)',
});

// Add dependencies
hubStack.addDependency(apiStack);
creativeStack.addDependency(apiStack);
securityStack.addDependency(apiStack);

// Tags for all stacks
const tags = cdk.Tags.of(app);
tags.add('Project', 'StealingLight');
tags.add('ManagedBy', 'CDK');

app.synth();
