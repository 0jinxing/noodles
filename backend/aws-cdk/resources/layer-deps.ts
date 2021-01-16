import { resolve } from 'path';
import { Stack } from "@aws-cdk/core";
import { Code, LayerVersion, Runtime } from "@aws-cdk/aws-lambda";

let layer: LayerVersion;

export function createDepsLayer(scope: Stack) {
  if (!layer) {
    layer = new LayerVersion(scope, "NoodlesDepsLambdaLayer", {
      code: Code.fromAsset(resolve("node_modules.out")),
      compatibleRuntimes: [Runtime.NODEJS_12_X]
    });
  }
  return layer;
}