#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ContactFormStack } from '../lib/contact-stack';

const app = new cdk.App();

new ContactFormStack(app, 'StealinglightContactForm', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-west-2',
  },
  fromEmail: 'noreply@stealinglight.hk',
  toEmail: 'stealinglight+website@gmail.com',
  allowedOrigins: [
    'https://stealinglight.hk',
    'https://www.stealinglight.hk',
    'http://localhost:5172',
    'http://localhost:5173',
  ],
});
