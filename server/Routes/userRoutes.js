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

    console.log(id);

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
      userToUpdate.name = newName;
    }

    const result = await db
      .collection("user")
      .updateOne({ _id: new ObjectId(id) }, { $set: userToUpdate });

    res.sendStatus(result.acknowledged ? 204 : 500);
  });

  return userRoutes;
}
