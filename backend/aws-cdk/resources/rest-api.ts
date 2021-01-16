import { resolve } from 'path';
import { Stack } from '@aws-cdk/core';
import { RestApi } from "@aws-cdk/aws-apigateway";
import { Function, Runtime } from "@aws-cdk/aws-lambda";
import { codeAsset } from '../code-asset';

let api: RestApi;
export function createRestApi(scope: Stack) {
  if (!api) {
    api = new RestApi(scope, "NoodlesApiGateway");

    const getTokenFn = new Function(scope, "GetTokenFn", {
      code: codeAsset,
      handler: "api/gen-token.handler",
      runtime: Runtime.NODEJS_12_X,
    });
  }
  return api;
}