import { Stack } from '@aws-cdk/core';
import { Table, AttributeType } from "@aws-cdk/aws-dynamodb";

let db: Table;
export function createDynamoDb(scope: Stack) {
  if (!db) {
    db = new Table(scope, "NoodlesMd5Table", {
      partitionKey: {
        name: "md5",
        type: AttributeType.STRING
      }
    });
  }
  return db;
}