export async function fetchExistingUser(db, email) {
  return await db.collection("user").findOne({ email });
}

export async function insertNewUser(db, user) {
  const newUser = {
    name: user.name,
    email: user.email,
    bio: "",
  };

  const result = await db.collection("user").insertOne(newUser);

  if (result.acknowledged) {
    return await db.collection("user").findOne({ _id: result.insertedId });
  }
}
