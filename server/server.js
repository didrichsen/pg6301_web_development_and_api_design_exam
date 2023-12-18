import express from "express";
import cookieParser from "cookie-parser";
import * as path from "path";
import bodyParser from "body-parser";
import { userMiddleware } from "./Utils/userMiddleware.js";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { WebSocketServer } from "ws";
import { authRoutes, createAuthRoutes } from "./Routes/authRoutes.js";
import { chatroomRoutes, createChatroomRoutes } from "./Routes/chatroomes.js";
import { createUserRoutes, userRoutes } from "./Routes/userRoutes.js";

dotenv.config();

const port = 3000;
const app = express();
const address = "http://localhost:3000";

const url = process.env.MONGODB;
const client = new MongoClient(url);

let db;
client.connect().then((connection) => {
  db = connection.db("pg301-exam");
  createAuthRoutes(db);
  createChatroomRoutes(db);
  createUserRoutes(db);
});

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.json());
app.use((req, res, next) => userMiddleware(req, res, next, db));

app.use("/api/auth", authRoutes);
app.use("/api/chatroom", chatroomRoutes);
app.use("/api/user", userRoutes);

app.use(express.static("../client/dist"));

app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    res.sendFile(path.resolve("../client/dist/index.html"));
  } else {
    next();
  }
});

const wsServer = new WebSocketServer({ noServer: true });

const server = app.listen(process.env.PORT || port, () => {
  console.log("Server started at port " + address);
});

const sockets = [];

server.on("upgrade", (req, socket, head) => {
  wsServer.handleUpgrade(req, socket, head, (socket) => {
    sockets.push(socket);
    socket.on("message", (message) => {
      const data = JSON.parse(message);
      for (const s of sockets) {
        s.send(JSON.stringify(data));
      }
    });
  });
});
