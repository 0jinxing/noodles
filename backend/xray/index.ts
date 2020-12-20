import AWS from "aws-sdk";
import AWSXRay from "aws-xray-sdk-core";

export const CaptureAWS = AWSXRay.captureAWS(AWS);
