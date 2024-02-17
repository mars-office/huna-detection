import { GridFSBucket, MongoClient } from "mongodb";

const mongoClient = new MongoClient(
  `mongodb://admin:${process.env.MONGODB_PASSWORD}@huna-mongodb:27017/`,
  {
    appName: "huna-detection",
  }
);

export const db = mongoClient.db("huna-detection");
export default db;

export const gridFsBucket = new GridFSBucket(db, {
  bucketName: 'files'
});