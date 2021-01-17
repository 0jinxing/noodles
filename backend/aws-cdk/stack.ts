#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { md5Bucket } from './resources/md5-bucket';
import { md5Db } from './resources/md5-db';
import { restApi } from './resources/rest-api';

class NoodlesStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    restApi(this);
    md5Db(this);
    md5Bucket(this);
  }
}

const app = new cdk.App();
new NoodlesStack(app, 'NoodlesStack');
