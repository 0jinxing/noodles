import {
  table,
  hashKey,
  attribute,
} from "@aws/dynamodb-data-mapper-annotations";

const TABLE_NAME = process.env.NOODLES_MD5_TABLE!;

@table(TABLE_NAME)
export class Md5Model {
  @hashKey()
  md5: string;

  @attribute()
  bucketKey: string;

  @attribute()
  bucketName: string;

  constructor(md5 = "", bucketKey = "", bucketName = "") {
    this.md5 = md5;
    this.bucketKey = bucketKey;
    this.bucketName = bucketName;
  }
}
