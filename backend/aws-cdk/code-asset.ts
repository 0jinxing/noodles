import { resolve } from "path";
import { Code } from "@aws-cdk/aws-lambda";

export const codeAsset = Code.fromAsset(resolve('dist'));
