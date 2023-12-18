import { fetchExistingUser, insertNewUser } from "./userUtils.js";
import dotenv from "dotenv";
dotenv.config();

const discovery_url_google = process.env.OPEN_ID_CONFIGURATION_GOOGLE;
const discovery_url_microsoft = process.env.OPEN_ID_CONFIGURATION_MICROSOFT;

export async function fetchUser(discovery_url, access_token) {
  const response = await fetch(discovery_url);
  const discoveryDoc = await response.json();

  const userInfoResponse = await fetch(discoveryDoc.userinfo_endpoint, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  if (!userInfoResponse) {
    throw new Error("Error while retrieving user error." + userInfoResponse);
  }

  return await userInfoResponse.json();
}

export async function userMiddleware(req, res, next, db) {
  const { access_token } = req.signedCookies;

  if (access_token) {
    let userInfo = await fetchUser(discovery_url_google, access_token);

    if (userInfo.error) {
      userInfo = await fetchUser(discovery_url_microsoft, access_token);
    }

    if (userInfo.error) {
      res.clearCookie("username");
      res.clearCookie("access_token");
      res.redirect("http://localhost:3000");
    }

    let user;

    user = await fetchExistingUser(db, userInfo.email);

    if (!user) {
      user = await insertNewUser(db, userInfo);
    }

    req.user = {
      ...userInfo,
      name: user.name,
      email: userInfo.email,
      bio: user.bio,
      _id: user._id,
    };
  }

  next();
}
