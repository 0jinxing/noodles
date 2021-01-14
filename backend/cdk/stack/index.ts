import * as cdk from '@aws-cdk/core';
import { createBucket } from './bucket';
import { createDynamoDb } from './dynamodb';
import { createRestApi } from './rest-api';

export class NoodlesStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    createDynamoDb(this);

    createBucket(this);
  }
}
