import express from "express";
import dotenv from "dotenv";
dotenv.config();

export const authRoutes = express.Router();

const open_id_microsoft = {
  client_id: process.env.CLIENT_ID_MICROSOFT,
  config_url: process.env.OPEN_ID_CONFIGURATION_MICROSOFT,
};

const open_id_google = {
  client_id: process.env.CLIENT_ID_GOOGLE,
  config_url: process.env.OPEN_ID_CONFIGURATION_GOOGLE,
};

export function createAuthRoutes(db) {
  authRoutes.delete("/logout", (req, res) => {
    res.clearCookie("username");
    res.clearCookie("access_token");
    res.sendStatus(204);
  });

  authRoutes.post("/login", (req, res) => {
    res.cookie("username", req.body.user, { signed: true });
    res.sendStatus(204);
  });

  authRoutes.get("/login", (req, res) => {
    //res.cookie("username", req.body.username, { signed: true });
    //res.cookie("username", req.body.user.name, { signed: true });
    res.send(req.user);
  });

  authRoutes.get("/config", (req, res) => {
    const user = req.user;
    res.send({ user, open_id_google, open_id_microsoft });
  });

  authRoutes.post("/login/access_token", (req, res) => {
    res.cookie("access_token", req.body.access_token, { signed: true });
    res.sendStatus(204);
  });
}
