import { CaptureAWS } from "../xray";

const s3client = new CaptureAWS.S3();

export function handler(event: {
  ResourceProperties: { bucket: string; fnArn: string };
  RequestType: "Create" | "Delete" | "Update";
}) {
  const {
    ResourceProperties: { bucket, fnArn },
    RequestType,
  } = event;
  if (RequestType === "Create") {
    s3client.putBucketNotificationConfiguration({
      Bucket: bucket,
      NotificationConfiguration: {
        LambdaFunctionConfigurations: [
          { LambdaFunctionArn: fnArn, Events: ["s3:ObjectCreated:*"] },
        ],
      },
    });
  }
  return "SUCCESS";
}
