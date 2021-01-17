import { Stack } from '@aws-cdk/core';
import { Bucket, EventType } from "@aws-cdk/aws-s3";
import { LambdaDestination } from '@aws-cdk/aws-s3-notifications';
import { md5Db } from './md5-db';
import { createFn } from '../utils/create-fn';
let bucket: Bucket;

export function md5Bucket(scope: Stack) {
  if (!bucket) {
    bucket = new Bucket(scope, "NoodlesBucket", { publicReadAccess: false });
    const md5Table = md5Db(scope);

    const calcFn = createFn(scope, "CalcHashFn", 'fn/calc-md5.handler', {
      NOODLES_MD5_TABLE: md5Table.tableName,
      NOODLES_BUCKET: bucket.bucketName
    })

    bucket.grantRead(calcFn);
    md5Table.grantReadWriteData(calcFn);

    bucket.addEventNotification(EventType.OBJECT_CREATED_PUT, new LambdaDestination(calcFn))
  }
  return bucket;

}