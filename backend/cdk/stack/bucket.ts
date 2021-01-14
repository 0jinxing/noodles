import { resolve } from 'path';
import { Stack } from '@aws-cdk/core';
import { Bucket, EventType } from "@aws-cdk/aws-s3";
import { LambdaDestination } from '@aws-cdk/aws-s3-notifications';
import { Code, Function, Runtime } from "@aws-cdk/aws-lambda";
import { createDepsLayer } from '../layer/layer-deps';
import { createCommonLayer } from '../layer/layer-common';
import { createDynamoDb } from './dynamodb';

let bucket: Bucket;

export function createBucket(scope: Stack) {
  if (!bucket) {
    bucket = new Bucket(scope, "NoodlesBucket");

    const calcFn = new Function(scope, "CalcHashFn", {
      code: Code.fromAsset(resolve('dist', 'fn')),
      handler: 'calc-md5.handler',
      runtime: Runtime.NODEJS_12_X,
      layers: [createDepsLayer(scope), createCommonLayer(scope)],
      environment: {
        NOODLES_MD5_TABLE: createDynamoDb(scope).tableName,
        BUCKET: bucket.bucketName
      }
    });
    bucket.addEventNotification(EventType.OBJECT_CREATED_PUT, new LambdaDestination(calcFn))
  }
  return bucket;

}