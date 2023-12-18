import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import { chatroomRoutes, createChatroomRoutes } from "../Routes/chatroomes.js";

const app = express();

dotenv.config();
app.use(bodyParser.json());

describe("testing chatrooms api", () => {
  let connection;

  beforeAll(async () => {
    const url = process.env.MONGODB;
    const client = new MongoClient(url);

    connection = await client.connect();
    const db = connection.db("pg301-exam-test-database");
    createChatroomRoutes(db);
    app.use("/api/chatroom", chatroomRoutes);
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should create a new chatroom", async () => {
    const chatroom = {
      chatroomTitle: "Test chatroom",
      description: "This is a test chatroom",
      admin: "Test Admin",
      participants: [],
      isPrivate: false,
      comments: [],
    };

    await request(app)
      .post("/api/chatroom/create")
      .send({ chatroom })
      .expect(204);
    const response = await request(app).get("/api/chatroom");
    expect(response.status).toBe(200);
    expect(response.body.map((m) => m.chatroomTitle)).toContain(
      chatroom.chatroomTitle,
    );
  });

  it("Should let a user post a message to an existing chatroom", async () => {
    const craftedMessage = "What an awesome movie on testing. Learned a lot!";
    const user = {
      email: "test@test.no",
    };

    const chatRoomArray = await request(app).get("/api/chatroom");
    const _id = new ObjectId(chatRoomArray.body[0]._id);

    await request(app)
      .post(`/api/chatroom/${_id}/comment`)
      .send({ craftedMessage, user })
      .expect(204);
  });

  it("Should update an existing chatroom with new title and description", async () => {
    const newChatroomTitle = "New chatroom title";
    const newDescription = "New description";

    let chatRoomArray = await request(app).get("/api/chatroom");
    const _id = new ObjectId(chatRoomArray.body[0]._id);

    await request(app)
      .put(`/api/chatroom/${_id}`)
      .send({ newChatroomTitle, newDescription })
      .expect(204);

    const id = chatRoomArray.body[0]._id;
    chatRoomArray = await request(app).get("/api/chatroom");
    const updatedChatroom = chatRoomArray.body.find((c) => c._id === id);

    expect(updatedChatroom.chatroomTitle).toBe(newChatroomTitle);
    expect(updatedChatroom.description).toBe(newDescription);
  });

  it("Should fetch a chatroom by id", async () => {
    let chatRoomArray = await request(app).get("/api/chatroom");
    const _id = new ObjectId(chatRoomArray.body[0]._id);

    const response = await request(app).get(`/api/chatroom/${_id}`);
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(_id.toString());
  });
});
