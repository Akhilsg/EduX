const express = require("express");
const {
  getPDFOptionsFromGPT,
  sendChatMessageToGPT,
  getChatById,
  getAllChats,
} = require("../controllers/openAIController");
const router = express.Router();

router.get("/get-pdf-options/:chatId", getPDFOptionsFromGPT);
router.post("/send-chat-message", sendChatMessageToGPT);
router.get("/chats", getAllChats);
router.get("/chat/:chatId", getChatById);

module.exports = router;
