#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { createBucket } from './resources/bucket';
import { createDynamoDb } from './resources/dynamodb';

class NoodlesStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    createDynamoDb(this);
    createBucket(this);
  }
}

const app = new cdk.App();
new NoodlesStack(app, 'NoodlesStack');
