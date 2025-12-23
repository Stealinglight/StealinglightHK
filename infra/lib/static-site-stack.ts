import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface StaticSiteStackProps extends cdk.StackProps {
  siteName: string;
  domainName: string;
  subdomains: string[];
  isApex: boolean;
  apiEndpoint?: string;
}

export class StaticSiteStack extends cdk.Stack {
  public readonly bucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;
  public readonly bucketName: string;
  public readonly distributionId: string;

  constructor(scope: Construct, id: string, props: StaticSiteStackProps) {
    super(scope, id, props);

    const { siteName, domainName, subdomains, isApex } = props;

    // Build list of domain names for this site
    const siteDomainNames: string[] = [];
    if (isApex) {
      siteDomainNames.push(domainName); // apex: stealinglight.hk
    }
    subdomains.forEach((sub) => {
      siteDomainNames.push(`${sub}.${domainName}`);
    });

    // Look up the hosted zone
    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName,
    });

    // Look up existing certificate from us-east-1 (required for CloudFront)
    // Certificate ARN will be passed via context or looked up
    const certificateArn = this.node.tryGetContext('certificateArn');
    
    let certificate: acm.ICertificate | undefined;
    if (certificateArn) {
      certificate = acm.Certificate.fromCertificateArn(
        this,
        'Certificate',
        certificateArn
      );
    }

    // Create S3 bucket for static site hosting (private bucket)
    this.bucket = new s3.Bucket(this, 'SiteBucket', {
      bucketName: `${siteName}.${domainName}`.replace(/\./g, '-'),
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
    });

    // Create Origin Access Control for CloudFront
    const oac = new cloudfront.CfnOriginAccessControl(this, 'OAC', {
      originAccessControlConfig: {
        name: `${siteName}-oac`,
        originAccessControlOriginType: 's3',
        signingBehavior: 'always',
        signingProtocol: 'sigv4',
      },
    });

    // Create CloudFront distribution
    const distributionProps: cloudfront.DistributionProps = {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new origins.S3Origin(this.bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
      },
      // SPA routing: return index.html for 403/404 errors
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(0),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(0),
        },
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
    };

    // Add certificate and domain names if certificate exists
    if (certificate) {
      Object.assign(distributionProps, {
        certificate,
        domainNames: siteDomainNames,
      });
    }

    this.distribution = new cloudfront.Distribution(
      this,
      'Distribution',
      distributionProps
    );

    // Update the CloudFront distribution to use OAC instead of OAI
    const cfnDistribution = this.distribution.node.defaultChild as cloudfront.CfnDistribution;
    
    // Remove OAI and add OAC
    cfnDistribution.addPropertyOverride(
      'DistributionConfig.Origins.0.S3OriginConfig.OriginAccessIdentity',
      ''
    );
    cfnDistribution.addPropertyOverride(
      'DistributionConfig.Origins.0.OriginAccessControlId',
      oac.attrId
    );

    // Update bucket policy to allow CloudFront OAC access
    this.bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        sid: 'AllowCloudFrontOAC',
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
        actions: ['s3:GetObject'],
        resources: [this.bucket.arnForObjects('*')],
        conditions: {
          StringEquals: {
            'AWS:SourceArn': `arn:aws:cloudfront::${this.account}:distribution/${this.distribution.distributionId}`,
          },
        },
      })
    );

    // Create Route53 records for all domain names (only if certificate exists)
    if (certificate) {
      siteDomainNames.forEach((domain, index) => {
        // Determine if this is apex or subdomain
        const recordName = domain === domainName ? undefined : domain.split('.')[0];
        
        new route53.ARecord(this, `AliasRecord${index}`, {
          zone: hostedZone,
          recordName,
          target: route53.RecordTarget.fromAlias(
            new route53Targets.CloudFrontTarget(this.distribution)
          ),
        });

        // Also create AAAA record for IPv6
        new route53.AaaaRecord(this, `AaaaRecord${index}`, {
          zone: hostedZone,
          recordName,
          target: route53.RecordTarget.fromAlias(
            new route53Targets.CloudFrontTarget(this.distribution)
          ),
        });
      });
    }

    // Store bucket name and distribution ID for CI/CD
    this.bucketName = this.bucket.bucketName;
    this.distributionId = this.distribution.distributionId;

    // Outputs
    new cdk.CfnOutput(this, 'BucketName', {
      value: this.bucket.bucketName,
      description: `S3 bucket for ${siteName} site`,
      exportName: `${siteName}-bucket-name`,
    });

    new cdk.CfnOutput(this, 'DistributionId', {
      value: this.distribution.distributionId,
      description: `CloudFront distribution ID for ${siteName} site`,
      exportName: `${siteName}-distribution-id`,
    });

    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: this.distribution.distributionDomainName,
      description: `CloudFront domain for ${siteName} site`,
    });

    if (siteDomainNames.length > 0) {
      new cdk.CfnOutput(this, 'SiteUrls', {
        value: siteDomainNames.map((d) => `https://${d}`).join(', '),
        description: `Site URLs for ${siteName}`,
      });
    }
  }
}
