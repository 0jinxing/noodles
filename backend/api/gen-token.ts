import { resp } from "../utils/resp";
import { CaptureAWS } from "../xray";

const ASSUME_ROLE_ARN: string = process.env.ASSUME_ROLE_ARN!;

export async function handler() {
  const stsClient = new CaptureAWS.STS();

  try {
    const result: AWS.STS.AssumeRoleResponse = await new Promise(
      (resolve, reject) => {
        stsClient.assumeRole(
          {
            RoleArn: ASSUME_ROLE_ARN,
            RoleSessionName: Date.now().toString(16),
          },
          (err, data) => {
            if (err) return reject(err);
            resolve(data);
          }
        );
      }
    );
    return resp(result.Credentials, 200);
  } catch (err) {
    console.error(err);
    return resp(null, 502);
  }
}
