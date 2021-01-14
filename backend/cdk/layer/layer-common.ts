import { resolve } from 'path';
import { Stack } from "@aws-cdk/core";
import { Code, LayerVersion, Runtime } from "@aws-cdk/aws-lambda";

let layer: LayerVersion;

export function createCommonLayer(scope: Stack) {
  if (!layer) {
    layer = new LayerVersion(scope, "NoodlesCommonLambdaLayer", {
      code: Code.fromAsset(resolve("dist/common")),
      compatibleRuntimes: [Runtime.NODEJS_12_X]
    });
  }
  return layer;
}