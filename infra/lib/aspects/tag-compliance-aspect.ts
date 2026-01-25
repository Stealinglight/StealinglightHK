import * as cdk from 'aws-cdk-lib';
import { IConstruct } from 'constructs';

export interface RequiredTags {
  Project: string;
  Environment: string;
  ManagedBy: string;
  Repository: string;
}

export class TagComplianceAspect implements cdk.IAspect {
  private readonly requiredTags: RequiredTags;

  constructor(requiredTags: RequiredTags) {
    this.requiredTags = requiredTags;
  }

  visit(node: IConstruct): void {
    if (cdk.TagManager.isTaggable(node)) {
      // Apply required tags
      cdk.Tags.of(node).add('Project', this.requiredTags.Project);
      cdk.Tags.of(node).add('Environment', this.requiredTags.Environment);
      cdk.Tags.of(node).add('ManagedBy', this.requiredTags.ManagedBy);
      cdk.Tags.of(node).add('Repository', this.requiredTags.Repository);
    }
  }
}
