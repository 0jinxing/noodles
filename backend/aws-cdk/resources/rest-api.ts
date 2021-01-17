import { Stack } from '@aws-cdk/core';
import { RestApi, LambdaIntegration } from "@aws-cdk/aws-apigateway";
import { md5Db } from './md5-db';
import { createFn } from '../utils/create-fn';
import { stsRole } from './sts-role';
import { Effect, PolicyStatement } from '@aws-cdk/aws-iam';

let api: RestApi;

export function restApi(scope: Stack) {
  if (!api) {
    api = new RestApi(scope, "NoodlesApiGateway");

    const baseEnv = {
      NOODLES_MD5_TABLE: md5Db(scope).tableName
    };

    const genTokenFn = createFn(scope, "GenTokenFn", "api/gen-token.handler", {
      ...baseEnv,
      ASSUME_ROLE_ARN: stsRole(scope).roleArn
    });

    // TODO 添加信任关系
    genTokenFn.addToRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["sts:AssumeRole"],
      resources: ["*"]
    }))

    const queryMd5Fn = createFn(scope, "QueryMd5Fn", "api/query-md5.handler", baseEnv);
    md5Db(scope).grantReadData(queryMd5Fn);

    // GET token
    api.root
      .addResource("token")
      .addMethod("GET", new LambdaIntegration(genTokenFn));

    // GET md5
    api.root.addResource("md5")
      .addMethod("GET", new LambdaIntegration(queryMd5Fn));

  }
  return api;
}