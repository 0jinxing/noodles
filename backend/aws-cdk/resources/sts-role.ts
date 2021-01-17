import { Stack } from "@aws-cdk/core";
import { Effect, PolicyStatement, Role, ServicePrincipal } from "@aws-cdk/aws-iam";

let role: Role;

export function stsRole(scope: Stack) {
  if (!role) {
    role = new Role(scope, "S3PutObjectRole", { assumedBy: new ServicePrincipal("lambda.amazonaws.com") });

    role.addToPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:PutObject"],
      resources: ["arn:aws:s3:::*"]
    }))
  }
  return role;
}