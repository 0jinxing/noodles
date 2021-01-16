import { DataMapper } from "@aws/dynamodb-data-mapper";
import { CaptureAWS } from "../xray";

const { REGION } = process.env;
const options = { region: REGION };

CaptureAWS.config.update(options);

const client = new CaptureAWS.DynamoDB();
export const mapper = new DataMapper({ client });
