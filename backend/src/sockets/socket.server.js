const { Server } = require("socket.io");
const { genrateResponse } = require("../services/ai.service");
const { v4: uuidv4 } = require("uuid");
const messageModel = require("../models/message.model");
const cookie = require("cookie");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

function initServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const getToken = cookie.parse(socket.handshake.headers.cookie || "");
    if (!getToken.token) {
      return next(new Error("unautharised."));
    }

    try {
      const decoded = jwt.verify(getToken.token, process.env.JWT_SECRET);
      const user = await userModel.findOne({
        _id: decoded.id,
      });
      socket.user = user;
      next();
    } catch (err) {
      console.log("error occured", err);
    }
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected!", socket.id);

    socket.on("chat", async (data) => {
      await messageModel.create({
        user: socket.user.id,
        content: data.parts[0].text,
        role: "user",
      });
      const messageHistory = await messageModel
        .find({ user:socket.user.id })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean()
        .then((results) => results.reverse());
      const stm = messageHistory.map(msg=>{
        return {
          role:msg.role,
          parts:[{text:msg.content}],
        }
      })
      const aiResponse = await genrateResponse(stm,data);
      socket.emit("chat-response", {
        id: uuidv4(),
        text: aiResponse,
        sender: "model",
      });
      await messageModel.create({
        user: socket.user.id,
        content: aiResponse,
        role: "model",
      });
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });
}

module.exports = initServer;
