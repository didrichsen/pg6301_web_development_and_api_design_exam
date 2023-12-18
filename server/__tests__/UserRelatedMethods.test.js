import express from "express";
import bodyParser from "body-parser";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import { fetchExistingUser, insertNewUser } from "../Utils/userUtils.js";

const app = express();

dotenv.config();
app.use(bodyParser.json());

describe("Testing methods related to fetching and storing user", () => {
  let connection;
  let db;

  beforeAll(async () => {
    const url = process.env.MONGODB;
    const client = new MongoClient(url);

    connection = await client.connect();
    db = connection.db("pg301-exam-test-database");
  });

  afterAll(async () => {
    await connection.close();
  });

  it("it should insert new user into the database", async () => {
    const newUser = {
      name: "Test User",
      email: "test@test.no",
      bio: "A test user inserted into db",
    };

    const result = await insertNewUser(db, newUser);
    const createdUser = await db
      .collection("user")
      .findOne({ email: newUser.email });
    expect(createdUser.email).toEqual(newUser.email);
  });

  it("it should fetch existing user from the database", async () => {
    const email = "test@test.no";

    const user = await fetchExistingUser(db, email);

    expect(user.email).toEqual(email);
  });
});
