import { resolve } from "path";
import { Code, LayerVersion } from "@aws-cdk/aws-lambda";
import { Function, Runtime } from "@aws-cdk/aws-lambda";
import { Stack } from "@aws-cdk/core";
import { Role } from "@aws-cdk/aws-iam";

const fnMap = new Map<string, Function>();

let depsLayer: LayerVersion;

export function createFn(scope: Stack, id: string, handler: string, environment: Record<string, string> = {}): Function {
  if (fnMap.has(id)) return fnMap.get(id)!;

  if (!depsLayer) {
    depsLayer = new LayerVersion(scope, "NoodlesDepsLambdaLayer", {
      code: Code.fromAsset(resolve("node_modules.out")),
      compatibleRuntimes: [Runtime.NODEJS_12_X]
    });
  }

  const fn = new Function(scope, id, {
    handler,
    code: Code.fromAsset(resolve('dist')),
    runtime: Runtime.NODEJS_12_X,
    layers: [depsLayer],
    environment
  });

  fnMap.set(id, fn);

  return fn;
}