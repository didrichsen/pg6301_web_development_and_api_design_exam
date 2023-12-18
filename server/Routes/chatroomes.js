import express from "express";
import { ObjectId } from "mongodb";

export const chatroomRoutes = express.Router();

export function createChatroomRoutes(db) {
  chatroomRoutes.post("/create", async (req, res) => {
    const { chatroom } = req.body;

    const result = await db.collection("chatroom").insertOne({
      chatroomTitle: chatroom.chatroomTitle,
      description: chatroom.description,
      admin: chatroom.admin,
      participants: chatroom.participants,
      isPrivate: chatroom.isPrivate,
      comments: [],
      chatroomCreatedDate: new Date(),
    });

    res.sendStatus(result.acknowledged ? 204 : 500);
  });

  chatroomRoutes.put("/:id", async (req, res) => {
    const id = req.params.id;
    const { newChatroomTitle, newDescription } = req.body;

    const chatroomToUpdate = await db
      .collection("chatroom")
      .findOne({ _id: new ObjectId(id) });

    if (!chatroomToUpdate) {
      return res.sendStatus(404);
    }

    if (newDescription !== "") {
      chatroomToUpdate.description = newDescription;
    }

    if (newChatroomTitle !== "") {
      chatroomToUpdate.chatroomTitle = newChatroomTitle;
    }

    const result = await db
      .collection("chatroom")
      .updateOne({ _id: new ObjectId(id) }, { $set: chatroomToUpdate });

    res.sendStatus(result.acknowledged ? 204 : 500);
  });

  chatroomRoutes.get("/:id", async (req, res) => {
    const id = req.params.id;
    const _id = new ObjectId(id);
    const result = await db.collection("chatroom").findOne({ _id });
    res.status(200).send(result);
  });

  chatroomRoutes.post("/:id/comment", async (req, res) => {
    const id = req.params.id;
    const { craftedMessage, user } = req.body;

    const commentToInsert = {
      comment: craftedMessage,
      postedBy: user.email,
      postedDate: new Date(),
    };

    const _id = new ObjectId(id);

    //Can use keyword returnDocument:after, to get the updated version.
    const result = await db
      .collection("chatroom")
      .findOneAndUpdate({ _id }, { $push: { comments: commentToInsert } });

    res.sendStatus(204);
  });

  chatroomRoutes.get("", async (req, res) => {
    const result = await db.collection("chatroom").find({}).toArray();
    res.status(200).send(result);
  });

  return chatroomRoutes;
}
