import crypto, { BinaryLike } from "crypto";
import { S3Event } from "aws-lambda";
import { Readable } from "stream";

import { CaptureAWS } from "../xray";
import { Md5Model } from "../model/md5.model";
import { mapper } from "../model";

const BUCKET = process.env.NOODLES_BUCKET!;
const s3Client = new CaptureAWS.S3();

export async function handler(event: S3Event) {
  const md5List = await Promise.all(
    event.Records.map(async (record) => {
      const bucketKey = decodeURI(record.s3.object.key);
      const params = {
        Bucket: BUCKET,
        Key: bucketKey,
      };

      const $object = s3Client.getObject(params).createReadStream();
      const md5 = await genMd5($object);

      return new Md5Model(md5, bucketKey, BUCKET);
    })
  );

  for await (const _ of mapper.batchPut(md5List)) void 0;

  return {
    statusCode: 200,
    body: JSON.stringify({ count: md5List.length }),
  };
}

async function genMd5(stream: Readable) {
  const md5Sum = crypto.createHash("md5");
  stream.on("data", (data: BinaryLike) => md5Sum.update(data));

  const md5 = await new Promise<string>((resolve) =>
    stream.on("end", () => resolve(md5Sum.digest("hex")))
  );

  return md5;
}
