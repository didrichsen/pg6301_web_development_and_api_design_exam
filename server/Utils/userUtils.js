import { ObjectId } from "mongodb";

export async function fetchExistingUser(db, email) {
  return await db.collection("user").findOne({ email });
}

export async function insertNewUser(db, user) {

  //All

  const publicChatRooms = await db
    .collection("chatroom")
    .find({ isPrivate: false })
    .toArray();

  const publicChatRoomIds = publicChatRooms.map((chatroom) => chatroom._id);

  const newUser = {
    name: user.name,
    email: user.email,
    bio: "",
    chatrooms: publicChatRoomIds,
  };

  const result = await db.collection("user").insertOne(newUser);

  if (result.acknowledged) {
    return await db.collection("user").findOne({ _id: result.insertedId });
  }
}
