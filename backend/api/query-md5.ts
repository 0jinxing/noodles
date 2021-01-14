import { ItemNotFoundException } from "@aws/dynamodb-data-mapper";
import { APIGatewayEvent } from "aws-lambda";
import { mapper } from "../common/model";
import { Md5Model } from "../common/model/md5.model";
import { resp } from "../common/utils/resp";

type QSParams = {
  md5?: string;
};

export async function handler(ev: APIGatewayEvent) {
  const { md5 } = ev.queryStringParameters as QSParams;

  if (!md5) return resp(null, 401);

  try {
    const item = await mapper.get<Md5Model>(Object.assign(new Md5Model(md5)));
    return resp(item, 200);
  } catch (err) {
    if (err instanceof ItemNotFoundException) {
      return resp(null, 200);
    }
    console.error(err);
    return resp(null, 502);
  }
}
