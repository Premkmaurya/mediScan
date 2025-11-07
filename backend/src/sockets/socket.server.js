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


  io.on("connection", (socket) => {
    console.log("✅ Socket connected!", socket.id);

    socket.on("chat", async (data) => {
      await messageModel.create({
        content: data.parts[0].text,
        role: "user",
      });
      const messageHistory = await messageModel
        .find()
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
