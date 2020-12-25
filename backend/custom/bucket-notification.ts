import { CloudFormationCustomResourceEvent, Context } from "aws-lambda";
import cfn from "cfn-response";
import { CaptureAWS } from "../xray";

const s3client = new CaptureAWS.S3();

export function handler(
  ev: {
    ResourceProperties: { bucket: string; fnArn: string };
  } & CloudFormationCustomResourceEvent,

  ctx: Context
) {
  const { bucket, fnArn } = ev.ResourceProperties;

  const PRId = ev.RequestType !== "Create" ? ev.PhysicalResourceId : undefined;

  if (ev.RequestType === "Create" || ev.RequestType === "Update") {
    s3client.putBucketNotificationConfiguration(
      {
        Bucket: bucket,
        NotificationConfiguration: {
          LambdaFunctionConfigurations: [
            { LambdaFunctionArn: fnArn, Events: ["s3:ObjectCreated:*"] },
          ],
        },
      },
      (err, data) => {
        if (err) {
          console.error(cfn.FAILED, err);
          return cfn.send(ev, ctx, cfn.FAILED, err, PRId);
        }

        console.log(cfn.SUCCESS, data);
        return cfn.send(ev, ctx, cfn.SUCCESS, data, PRId);
      }
    );
  } else {
    cfn.send(ev, ctx, cfn.SUCCESS, {}, PRId);
  }
  return ev.RequestType;
}
