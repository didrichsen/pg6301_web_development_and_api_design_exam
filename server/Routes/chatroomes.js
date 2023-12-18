import express from "express";
import { ObjectId } from "mongodb";
import { fetchExistingUser } from "../Utils/userUtils.js";

export const chatroomRoutes = express.Router();

export function createChatroomRoutes(db) {
  chatroomRoutes.post("/create", async (req, res) => {
    const { chatroom } = req.body;

    const existingChatroom = await db
      .collection("chatroom")
      .findOne({ chatroomTitle: chatroom.chatroomTitle });

    if (existingChatroom) {
      return res.sendStatus(409);
    }

    const result = await db.collection("chatroom").insertOne({
      chatroomTitle: chatroom.chatroomTitle,
      description: chatroom.description,
      admin: chatroom.admin,
      participants: chatroom.participants,
      isPrivate: chatroom.isPrivate,
      comments: [],
      chatroomCreatedDate: new Date(),
    });

    const chatroomId = result.insertedId;

    if (chatroom.isPrivate) {
      for (const user of chatroom.participants) {
        await db
          .collection("user")
          .updateOne(
            { _id: new ObjectId(user._id) },
            { $push: { chatrooms: chatroomId } },
          );
      }
    } else {
      await db
        .collection("user")
        .updateMany({}, { $push: { chatrooms: chatroomId } });
    }

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

  chatroomRoutes.delete("/:id", async (req, res) => {
    const id = req.params.id;

    const chatroomToDelete = await db
      .collection("chatroom")
      .findOne({ _id: new ObjectId(id) });

    if (!chatroomToDelete) {
      return res.sendStatus(404);
    }

    await db
      .collection("user")
      .updateMany(
        { chatrooms: new ObjectId(id) },
        { $pull: { chatrooms: new ObjectId(id) } },
      );

    const result = await db
      .collection("chatroom")
      .deleteOne({ _id: new ObjectId(id) });

    res.sendStatus(result.acknowledged ? 204 : 500);
  });

  chatroomRoutes.get("/:id", async (req, res) => {
    const id = req.params.id;
    const _id = new ObjectId(id);
    const result = await db.collection("chatroom").findOne({ _id });

    const comments = result.comments;

    res.status(200).send(result);
  });

  chatroomRoutes.post("/:id/comment", async (req, res) => {
    const id = req.params.id;
    const { newComment, user } = req.body;

    const commentToInsert = {
      comment: newComment,
      postedByName: user.name,
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
