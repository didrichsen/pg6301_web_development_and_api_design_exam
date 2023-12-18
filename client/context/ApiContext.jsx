import React from "react";

export const ApiContext = React.createContext({
  user: undefined,
  fetchChatrooms: async () => [],
  fetchUser: async () => {},
  createChatroom: async () => {},
  addComment: async () => {},
  fetchAllUsers: async () => {},
  loadUser: async () => {},
});

export async function fetchChatrooms() {
  try {
    const response = await fetch("/api/chatroom");

    if (!response.ok) {
      throw new Error("Something went wrong while fetching chatrooms.");
    }

    const data = await response.json();

    return { data, error: null };
  } catch (error) {
    return { error };
  }
}

export async function fetchUser() {
  try {
    const response = await fetch("/api/auth/login");

    if (!response.ok) {
      throw new Error("Something went wrong while fetching user.");
    }

    const data = await response.json();

    return { data, error: null };
  } catch (error) {
    return { error };
  }
}

export async function createChatroom(chatroom) {
  try {
    const response = await fetch("/api/chatroom/create", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ chatroom }),
    });

    if (!response.ok) {
      throw new Error("Something went wrong while posting chatroom.");
    }

    return { error: null };
  } catch (error) {
    return { error };
  }
}

export async function addComment(craftedMessage, user, chatroom) {
  try {
    const result = await fetch(`/api/chatroom/${chatroom._id}/comment`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ craftedMessage, user }),
    });

    if (!result.ok) {
      throw new Error("Something went wrong went posting comment.");
    }

    return { error: null };
  } catch (error) {
    return { error };
  }
}

export async function fetchAllUsers() {
  try {
    const response = await fetch("/api/user");

    if (!response.ok) {
      throw new Error("Something went wrong while fetching users.");
    }

    const data = await response.json();

    return { data, error: null };
  } catch (error) {
    return { error };
  }
}

export async function fetchChatRoomById(id) {
  try {
    const response = await fetch(`/api/chatroom/${id}`);

    if (!response.ok) {
      throw new Error("Something went wrong while fetching chatroom.");
    }

    const data = await response.json();

    return { data, error: null };
  } catch (error) {
    return { error };
  }
}

export async function updateUser(newName, newBio, user) {
  try {
    const result = await fetch(`/api/user/${user._id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ newName, newBio }),
    });

    if (!result.ok) {
      throw new Error("Something went wrong when updating user");
    }

    return { error: null };
  } catch (error) {
    return { error };
  }
}

export async function updateChatroom(newChatroomTitle, newDescription, id) {
  try {
    const result = await fetch(`/api/chatroom/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ newChatroomTitle, newDescription }),
    });

    if (!result.ok) {
      throw new Error("Something went wrong when updating chatroom");
    }

    return { error: null };
  } catch (error) {
    return { error };
  }
}
