const Chat = require("../models/Chat");
const { OpenAI } = require("openai");
const openai = new OpenAI();

exports.getPDFOptionsFromGPT = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found." });
    }

    const format = {
      options: [
        "option with max length of 15 words",
        "option with max length of 15 words",
        "option with max length of 15 words",
      ],
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI that can generate three useful options that you can perform on the text, helping the user, based on the text provided. Only provide options that you can help the user with. \nYou are to output the following in json format: ${JSON.stringify(
            format
          )} \nDo not put quotation marks or escape character \\ in the output fields.`,
        },
        {
          role: "user",
          content: `Based on the following text extracted from a PDF, generate three different actionable options for a user: "${chat.extractedText}"`,
        },
      ],
      max_tokens: 100,
      n: 1,
      stop: null,
      temperature: 0.7,
    });

    let message =
      response.choices[0].message?.content?.replace(/'/g, '"') ?? "";
    message = message.replace(/(\w)"(\w)/g, "$1'$2");

    const startIndex = message.indexOf("[");
    const endIndex = message.lastIndexOf("]") + 1;

    const options = message.slice(startIndex, endIndex);
    res.status(200).json({
      message: "Options generated successfully",
      options: JSON.parse(options),
    });
  } catch (error) {
    console.error("Error generating options from GPT:", error);
    res.status(500).json({ error: "Error generating options from GPT" });
  }
};

exports.sendChatMessageToGPT = async (req, res) => {
  const { message, chatId } = req.body;

  if (!message || !chatId) {
    return res.status(400).json({ error: "Message and chatId are required." });
  }

  try {
    let chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found." });
    }

    chat.messages.push({ role: "user", content: message });

    const format = {
      response: "response to their command",
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful api bot that can perform actions based on text that you receive from the user.\nYou are to output the following ONLY in this json format: ${JSON.stringify(
            format
          )} \nDo not put quotation marks or escape character \\ in the output fields. Do not include any other arrays or objects in the output fields. You can use HTML elements in your response to make your message clearer. For example, you can use <b> or <strong> to bold key terms, <u> to underline important points, and <br/> to add line breaks where necessary. `,
        },
        {
          role: "user",
          content: `The user uploaded the following content: "${chat.extractedText}". The user selected the following option: "${message}". Provide a helpful response based on the extracted content.`,
        },
      ],
      temperature: 0.7,
    });

    let gptResponse =
      response.choices[0].message?.content?.replace(/'/g, '"') ?? "";
    gptResponse = JSON.parse(
      gptResponse.replace(/(\w)"(\w)/g, "$1'$2")
    ).response;

    chat.messages.push({ role: "bot", content: gptResponse });

    await chat.save();

    res
      .status(200)
      .json({ message: "Response from GPT", response: gptResponse });
  } catch (error) {
    console.error("Error communicating with GPT:", error);
    res.status(500).json({ error: "Error communicating with GPT" });
  }
};

exports.getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ chatDate: -1 });

    if (!chats.length) {
      return res.status(404).json({ error: "No chats found" });
    }

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching all chats:", error);
    res.status(500).json({ error: "Error fetching all chats" });
  }
};

exports.getChatById = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const imageBase64 = chat.image.data.toString("base64");

    res.status(200).json({
      ...chat.toObject(),
      image: {
        contentType: chat.image.contentType,
        data: imageBase64,
      },
    });
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({ error: "Error fetching chat" });
  }
};
