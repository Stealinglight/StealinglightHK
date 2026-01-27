import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';

export interface MediaStackProps extends cdk.StackProps {
  appName: string;
  environment: string;
}

export class MediaStack extends cdk.Stack {
  public readonly bucketName: string;
  public readonly distributionDomain: string;

  constructor(scope: Construct, id: string, props: MediaStackProps) {
    super(scope, id, props);

    // S3 bucket for video storage (private, CloudFront access only)
    const mediaBucket = new s3.Bucket(this, 'MediaBucket', {
      bucketName: `${props.appName}-media-${this.account}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: false, // Videos don't need versioning
      removalPolicy: cdk.RemovalPolicy.RETAIN, // Keep videos on stack deletion
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.HEAD],
          allowedOrigins: ['*'], // CloudFront will handle origin restrictions
          allowedHeaders: ['*'],
          maxAge: 3600,
        },
      ],
    });

    // CloudFront distribution with video-optimized caching
    const distribution = new cloudfront.Distribution(this, 'MediaDistribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(mediaBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: new cloudfront.CachePolicy(this, 'VideoCachePolicy', {
          cachePolicyName: `${props.appName}-video-cache-policy`,
          comment: 'Cache policy optimized for video streaming',
          defaultTtl: cdk.Duration.days(30),
          maxTtl: cdk.Duration.days(365),
          minTtl: cdk.Duration.days(1),
          enableAcceptEncodingGzip: true,
          enableAcceptEncodingBrotli: true,
        }),
        responseHeadersPolicy: new cloudfront.ResponseHeadersPolicy(this, 'VideoResponseHeaders', {
          responseHeadersPolicyName: `${props.appName}-video-response-headers`,
          comment: 'Response headers for video delivery',
          corsBehavior: {
            accessControlAllowCredentials: false,
            accessControlAllowHeaders: ['*'],
            accessControlAllowMethods: ['GET', 'HEAD', 'OPTIONS'],
            accessControlAllowOrigins: ['*'],
            accessControlMaxAge: cdk.Duration.hours(1),
            originOverride: true,
          },
        }),
      },
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100, // US, Canada, Europe (cost-effective)
      comment: `${props.appName} media CDN`,
      enabled: true,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
    });

    this.bucketName = mediaBucket.bucketName;
    this.distributionDomain = distribution.distributionDomainName;

    // Outputs
    new cdk.CfnOutput(this, 'MediaBucketName', {
      value: mediaBucket.bucketName,
      description: 'S3 bucket name for video uploads',
      exportName: `${props.appName}-media-bucket-name`,
    });

    new cdk.CfnOutput(this, 'CloudFrontDistributionDomain', {
      value: distribution.distributionDomainName,
      description: 'CloudFront distribution domain for video delivery',
      exportName: `${props.appName}-cloudfront-domain`,
    });

    new cdk.CfnOutput(this, 'CloudFrontDistributionId', {
      value: distribution.distributionId,
      description: 'CloudFront distribution ID',
      exportName: `${props.appName}-cloudfront-distribution-id`,
    });

    new cdk.CfnOutput(this, 'ExampleVideoUrl', {
      value: `https://${distribution.distributionDomainName}/Reels/Company/BLNK_2020-Reel.mp4`,
      description: 'Example video URL (after upload)',
    });
  }
}
