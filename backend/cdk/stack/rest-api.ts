import { Stack } from '@aws-cdk/core';
import { RestApi } from "@aws-cdk/aws-apigateway";

let api: RestApi;
export function createRestApi(scope: Stack) {
  if (!api) {
    api = new RestApi(scope, "NoodlesApiGateway");
  }
  return api;
}