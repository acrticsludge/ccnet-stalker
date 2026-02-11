import { MongoClient, ServerApiVersion, Db } from "mongodb";

const uri = process.env.MONGO_URI!;
if (!uri) throw new Error("Missing MONGO_URI");

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDB(): Promise<Db> {
  const client = await clientPromise;
  return client.db("ccnet-stalker-data");
}
