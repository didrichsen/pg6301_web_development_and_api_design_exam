import express from "express";
import { ObjectId } from "mongodb";

export const userRoutes = express.Router();

export function createUserRoutes(db) {
  userRoutes.get("", async (req, res) => {
    const result = await db.collection("user").find({}).toArray();
    res.status(200).send(result);
  });

  userRoutes.get("/:id", async (req, res) => {
    const id = req.params.id;
    const result = await db
      .collection("user")
      .findOne({ _id: new ObjectId(id) });
    res.status(200).send(result);
  });

  userRoutes.put("/:id", async (req, res) => {
    const id = req.params.id;
    const { newBio, newName } = req.body;

    const userToUpdate = await db
      .collection("user")
      .findOne({ _id: new ObjectId(id) });

    if (!userToUpdate) {
      return res.sendStatus(404);
    }

    if (newBio !== "") {
      userToUpdate.bio = newBio;
    }

    if (newName !== "") {
      console.log("New Name: " + newName);
      const chatroomIds = userToUpdate.chatrooms;
      console.log(chatroomIds);
      for (const chatroomId of chatroomIds) {
        let chatRoom = await db
          .collection("chatroom")
          .findOne({ _id: new ObjectId(chatroomId) });

        if (chatRoom.comments.length !== 0) {
          console.log(chatRoom.comments[0].postedByName);
        }

        for (let i = 0; i < chatRoom.comments.length; i++) {
          if (chatRoom.comments[i].postedByName === userToUpdate.name) {
            console.log("Before Update: " + chatRoom.comments[i].postedByName);
            chatRoom.comments[i].postedByName = newName;
            console.log("After Update: " + chatRoom.comments[i].postedByName);
          }
        }

        await db
          .collection("chatroom")
          .updateOne(
            { _id: new ObjectId(chatroomId) },
            { $set: { comments: chatRoom.comments } },
          );
      }

      userToUpdate.name = newName;
    }

    const result = await db
      .collection("user")
      .updateOne({ _id: new ObjectId(id) }, { $set: userToUpdate });

    res.sendStatus(result.acknowledged ? 204 : 500);
  });

  return userRoutes;
}
