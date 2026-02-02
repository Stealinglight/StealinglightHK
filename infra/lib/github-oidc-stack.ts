import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface GithubOidcStackProps extends cdk.StackProps {
  /**
   * GitHub repository owner (username or organization)
   */
  repositoryOwner: string;

  /**
   * GitHub repository name
   */
  repositoryName: string;

  /**
   * Branches allowed to assume the deployment role
   * @default ['main']
   */
  allowedBranches?: string[];

  /**
   * Whether to allow pull requests to assume the role
   * Set to false for production deployments for security
   * @default false
   */
  allowPullRequests?: boolean;

  /**
   * ARN of an existing GitHub OIDC provider to use instead of creating a new one.
   * Use this if the provider was already created by another stack or manually.
   * @default - creates a new OIDC provider
   */
  existingOidcProviderArn?: string;

  /**
   * GitHub repository name as it appears in GitHub (case-sensitive).
   * Use this if the GitHub repo name differs in case from the CDK naming convention.
   * @default - uses repositoryName
   */
  githubRepositoryName?: string;
}

/**
 * Stack that creates GitHub Actions OIDC authentication for AWS deployments.
 *
 * This eliminates the need for long-lived AWS credentials by allowing GitHub Actions
 * to exchange a short-lived JWT token for temporary AWS credentials via OIDC.
 *
 * @see https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services
 */
export class GithubOidcStack extends cdk.Stack {
  /**
   * The IAM role that GitHub Actions will assume
   */
  public readonly deploymentRole: iam.Role;

  /**
   * The OIDC provider for GitHub Actions
   */
  public readonly oidcProvider: iam.IOpenIdConnectProvider;

  constructor(scope: Construct, id: string, props: GithubOidcStackProps) {
    super(scope, id, props);

    const {
      repositoryOwner,
      repositoryName,
      allowedBranches = ['main'],
      allowPullRequests = false,
      existingOidcProviderArn,
      githubRepositoryName,
    } = props;

    // Use githubRepositoryName for trust policy (case-sensitive for GitHub)
    // Fall back to repositoryName if not specified
    const trustPolicyRepoName = githubRepositoryName ?? repositoryName;

    // Use existing OIDC provider or create a new one
    // GitHub's OIDC provider is account-wide, so if another stack or manual setup
    // already created it, we import by ARN instead of creating a duplicate
    if (existingOidcProviderArn) {
      this.oidcProvider = iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(
        this,
        'GithubOidcProvider',
        existingOidcProviderArn
      );
    } else {
      // Create OIDC Provider for GitHub Actions
      // The thumbprint is used to verify the identity of the OIDC provider
      // GitHub's thumbprint is stable and documented
      this.oidcProvider = new iam.OpenIdConnectProvider(this, 'GithubOidcProvider', {
        url: 'https://token.actions.githubusercontent.com',
        clientIds: ['sts.amazonaws.com'],
        // GitHub OIDC thumbprints - AWS validates these automatically for GitHub
        // See: https://github.blog/changelog/2023-06-27-github-actions-update-on-oidc-integration-with-aws/
      });
    }

    // Build the subject claim conditions for the trust policy
    // Format: repo:OWNER/REPO:ref:refs/heads/BRANCH or repo:OWNER/REPO:pull_request
    const subjectClaims: string[] = [];

    // Add branch-based claims
    for (const branch of allowedBranches) {
      subjectClaims.push(`repo:${repositoryOwner}/${trustPolicyRepoName}:ref:refs/heads/${branch}`);
    }

    // Optionally add pull request claim
    if (allowPullRequests) {
      subjectClaims.push(`repo:${repositoryOwner}/${trustPolicyRepoName}:pull_request`);
    }

    // Create IAM Role with trust policy for GitHub Actions
    this.deploymentRole = new iam.Role(this, 'GithubActionsDeploymentRole', {
      roleName: `${repositoryName}-github-actions-deployment`,
      description: `Deployment role for GitHub Actions CI/CD from ${repositoryOwner}/${repositoryName}`,
      maxSessionDuration: cdk.Duration.hours(1),
      assumedBy: new iam.FederatedPrincipal(
        this.oidcProvider.openIdConnectProviderArn,
        {
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          },
          StringLike: {
            'token.actions.githubusercontent.com:sub': subjectClaims,
          },
        },
        'sts:AssumeRoleWithWebIdentity'
      ),
    });

    // Add scoped permissions for CDK deployments
    // These permissions allow CDK to manage CloudFormation stacks and related resources
    this.addCdkDeploymentPermissions();

    // Outputs
    new cdk.CfnOutput(this, 'GithubActionsRoleArn', {
      value: this.deploymentRole.roleArn,
      description: 'IAM Role ARN for GitHub Actions - add this to repository secrets as AWS_ROLE_ARN',
      exportName: `${repositoryName}-github-actions-role-arn`,
    });

    new cdk.CfnOutput(this, 'OidcProviderArn', {
      value: this.oidcProvider.openIdConnectProviderArn,
      description: 'OIDC Provider ARN for GitHub Actions',
      exportName: `${repositoryName}-github-oidc-provider-arn`,
    });

    new cdk.CfnOutput(this, 'AllowedSubjects', {
      value: subjectClaims.join(', '),
      description: 'GitHub subject claims allowed to assume this role',
    });
  }

  /**
   * Adds IAM permissions required for CDK deployments.
   *
   * Permissions are scoped to specific services and resources where possible
   * to follow the principle of least privilege.
   */
  private addCdkDeploymentPermissions(): void {
    // CloudFormation - required for CDK stack operations
    this.deploymentRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'CloudFormationFullAccess',
        effect: iam.Effect.ALLOW,
        actions: [
          'cloudformation:CreateStack',
          'cloudformation:UpdateStack',
          'cloudformation:DeleteStack',
          'cloudformation:DescribeStacks',
          'cloudformation:DescribeStackEvents',
          'cloudformation:DescribeStackResources',
          'cloudformation:GetTemplate',
          'cloudformation:GetTemplateSummary',
          'cloudformation:ListStacks',
          'cloudformation:ValidateTemplate',
          'cloudformation:CreateChangeSet',
          'cloudformation:DeleteChangeSet',
          'cloudformation:DescribeChangeSet',
          'cloudformation:ExecuteChangeSet',
          'cloudformation:ListChangeSets',
        ],
        resources: ['*'],
      })
    );

    // S3 - required for CDK asset staging and Amplify
    this.deploymentRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'S3BucketManagement',
        effect: iam.Effect.ALLOW,
        actions: [
          's3:CreateBucket',
          's3:DeleteBucket',
          's3:GetBucketLocation',
          's3:GetBucketPolicy',
          's3:PutBucketPolicy',
          's3:DeleteBucketPolicy',
          's3:GetBucketVersioning',
          's3:PutBucketVersioning',
          's3:GetBucketPublicAccessBlock',
          's3:PutBucketPublicAccessBlock',
          's3:GetEncryptionConfiguration',
          's3:PutEncryptionConfiguration',
          's3:GetLifecycleConfiguration',
          's3:PutLifecycleConfiguration',
          's3:GetBucketCORS',
          's3:PutBucketCORS',
          's3:DeleteBucketCORS',
          's3:ListBucket',
          's3:GetObject',
          's3:PutObject',
          's3:DeleteObject',
          's3:GetObjectTagging',
          's3:PutObjectTagging',
        ],
        resources: ['*'],
      })
    );

    // IAM - required for creating roles for Lambda, Amplify, etc.
    this.deploymentRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'IAMRoleManagement',
        effect: iam.Effect.ALLOW,
        actions: [
          'iam:CreateRole',
          'iam:DeleteRole',
          'iam:GetRole',
          'iam:UpdateRole',
          'iam:PassRole',
          'iam:AttachRolePolicy',
          'iam:DetachRolePolicy',
          'iam:PutRolePolicy',
          'iam:DeleteRolePolicy',
          'iam:GetRolePolicy',
          'iam:ListRolePolicies',
          'iam:ListAttachedRolePolicies',
          'iam:TagRole',
          'iam:UntagRole',
          'iam:CreatePolicy',
          'iam:DeletePolicy',
          'iam:GetPolicy',
          'iam:GetPolicyVersion',
          'iam:ListPolicyVersions',
          'iam:CreatePolicyVersion',
          'iam:DeletePolicyVersion',
          'iam:CreateServiceLinkedRole',
        ],
        resources: ['*'],
      })
    );

    // Lambda - required for Contact Stack
    this.deploymentRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'LambdaManagement',
        effect: iam.Effect.ALLOW,
        actions: [
          'lambda:CreateFunction',
          'lambda:DeleteFunction',
          'lambda:GetFunction',
          'lambda:GetFunctionConfiguration',
          'lambda:UpdateFunctionCode',
          'lambda:UpdateFunctionConfiguration',
          'lambda:InvokeFunction',
          'lambda:AddPermission',
          'lambda:RemovePermission',
          'lambda:GetPolicy',
          'lambda:TagResource',
          'lambda:UntagResource',
          'lambda:ListTags',
          'lambda:PublishVersion',
          'lambda:CreateAlias',
          'lambda:DeleteAlias',
          'lambda:UpdateAlias',
          'lambda:GetAlias',
        ],
        resources: ['*'],
      })
    );

    // API Gateway - required for Contact Stack REST API
    this.deploymentRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'ApiGatewayManagement',
        effect: iam.Effect.ALLOW,
        actions: [
          'apigateway:GET',
          'apigateway:POST',
          'apigateway:PUT',
          'apigateway:DELETE',
          'apigateway:PATCH',
          'apigateway:TagResource',
          'apigateway:UntagResource',
        ],
        resources: ['*'],
      })
    );

    // Amplify - required for Amplify Hosting Stack
    this.deploymentRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'AmplifyManagement',
        effect: iam.Effect.ALLOW,
        actions: [
          'amplify:CreateApp',
          'amplify:DeleteApp',
          'amplify:GetApp',
          'amplify:UpdateApp',
          'amplify:CreateBranch',
          'amplify:DeleteBranch',
          'amplify:GetBranch',
          'amplify:UpdateBranch',
          'amplify:CreateDomainAssociation',
          'amplify:DeleteDomainAssociation',
          'amplify:GetDomainAssociation',
          'amplify:UpdateDomainAssociation',
          'amplify:TagResource',
          'amplify:UntagResource',
          'amplify:ListTagsForResource',
        ],
        resources: ['*'],
      })
    );

    // CloudFront - required for Media Stack CDN
    this.deploymentRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'CloudFrontManagement',
        effect: iam.Effect.ALLOW,
        actions: [
          'cloudfront:CreateDistribution',
          'cloudfront:DeleteDistribution',
          'cloudfront:GetDistribution',
          'cloudfront:GetDistributionConfig',
          'cloudfront:UpdateDistribution',
          'cloudfront:CreateOriginAccessControl',
          'cloudfront:DeleteOriginAccessControl',
          'cloudfront:GetOriginAccessControl',
          'cloudfront:UpdateOriginAccessControl',
          'cloudfront:CreateCachePolicy',
          'cloudfront:DeleteCachePolicy',
          'cloudfront:GetCachePolicy',
          'cloudfront:CreateOriginRequestPolicy',
          'cloudfront:DeleteOriginRequestPolicy',
          'cloudfront:GetOriginRequestPolicy',
          'cloudfront:TagResource',
          'cloudfront:UntagResource',
          'cloudfront:ListTagsForResource',
        ],
        resources: ['*'],
      })
    );

    // Route53 - required for custom domain setup
    this.deploymentRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'Route53Management',
        effect: iam.Effect.ALLOW,
        actions: [
          'route53:CreateHostedZone',
          'route53:DeleteHostedZone',
          'route53:GetHostedZone',
          'route53:ListHostedZones',
          'route53:ChangeResourceRecordSets',
          'route53:GetChange',
          'route53:ListResourceRecordSets',
          'route53:ChangeTagsForResource',
          'route53:ListTagsForResource',
        ],
        resources: ['*'],
      })
    );

    // CloudWatch Logs - required for Lambda logging
    this.deploymentRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'CloudWatchLogsManagement',
        effect: iam.Effect.ALLOW,
        actions: [
          'logs:CreateLogGroup',
          'logs:DeleteLogGroup',
          'logs:DescribeLogGroups',
          'logs:PutRetentionPolicy',
          'logs:DeleteRetentionPolicy',
          'logs:TagLogGroup',
          'logs:UntagLogGroup',
          'logs:ListTagsLogGroup',
        ],
        resources: ['*'],
      })
    );

    // SES - required for Contact Stack email sending
    this.deploymentRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'SESReadAccess',
        effect: iam.Effect.ALLOW,
        actions: [
          'ses:GetIdentityVerificationAttributes',
          'ses:GetAccountSendingEnabled',
        ],
        resources: ['*'],
      })
    );

    // SSM Parameter Store - for CDK bootstrap version check
    this.deploymentRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'SSMParameterAccess',
        effect: iam.Effect.ALLOW,
        actions: [
          'ssm:GetParameter',
          'ssm:GetParameters',
        ],
        resources: [
          `arn:aws:ssm:*:${this.account}:parameter/cdk-bootstrap/*`,
        ],
      })
    );

    // STS - for getting caller identity
    this.deploymentRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'STSGetCallerIdentity',
        effect: iam.Effect.ALLOW,
        actions: ['sts:GetCallerIdentity'],
        resources: ['*'],
      })
    );
  }
}
