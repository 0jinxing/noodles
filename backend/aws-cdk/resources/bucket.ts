import { Stack } from '@aws-cdk/core';
import { Bucket, EventType } from "@aws-cdk/aws-s3";
import { LambdaDestination } from '@aws-cdk/aws-s3-notifications';
import { Function, Runtime } from "@aws-cdk/aws-lambda";
import { createDepsLayer } from './layer-deps';
import { createDynamoDb } from './dynamodb';
import { codeAsset } from '../code-asset';

let bucket: Bucket;

export function createBucket(scope: Stack) {
  if (!bucket) {
    bucket = new Bucket(scope, "NoodlesBucket", { publicReadAccess: false });
    const md5Table = createDynamoDb(scope);

    const calcFn = new Function(scope, "CalcHashFn", {
      code: codeAsset,
      handler: 'fn/calc-md5.handler',
      runtime: Runtime.NODEJS_12_X,
      layers: [createDepsLayer(scope)],
      environment: {
        NOODLES_MD5_TABLE: md5Table.tableName,
        NOODLES_BUCKET: bucket.bucketName
      }
    });
    
    bucket.grantRead(calcFn);
    md5Table.grantReadWriteData(calcFn);

    bucket.addEventNotification(EventType.OBJECT_CREATED_PUT, new LambdaDestination(calcFn))
  }
  return bucket;

}