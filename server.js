import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import cron from "node-cron";

dotenv.config();

const app = express();

if (!process.env.MONGO_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGO_URI"');
}

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    db = client.db("ccnet-stalker-data");
  } catch (err) {
    console.error("Failed to connect", err);
    process.exit(1);
  }
}

async function StartServer() {
  await connectDB();
  const app = express();
  const port = 3000;

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.listen(port, () => {
    console.log(`Listening port on ${port}`);
  });
}

StartServer();
