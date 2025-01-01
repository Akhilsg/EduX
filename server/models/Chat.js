const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  extractedText: { type: String },
  image: {
    data: Buffer,
    contentType: String,
    name: String,
  },
  messages: [
    {
      role: { type: String, enum: ["user", "bot"], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  chatDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Chat", ChatSchema);
