const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");
const fs = require("fs");
const Chat = require("../models/Chat");

exports.extractTextFromFile = async (req, res) => {
  const { file } = req;

  try {
    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    const filePath = file.path;
    const fileType = file.mimetype;

    let extractedText = "";

    if (fileType === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      extractedText = data.text;
    } else if (fileType === "image/png" || fileType === "image/jpeg") {
      const result = await Tesseract.recognize(filePath, "eng");
      extractedText = result.data.text;
    } else {
      return res.status(400).json({
        error: "Invalid file type. Only PDFs, PNG, and JPEG files are allowed.",
      });
    }

    const newChat = new Chat({
      extractedText,
      image: {
        data: fs.readFileSync(filePath),
        contentType: file.mimetype,
        name: file.originalname,
      },
    });

    await newChat.save();
    fs.unlinkSync(filePath);

    res.status(200).json({
      message: "Text extracted and chat created successfully",
      text: extractedText,
      chatId: newChat._id,
    });
  } catch (error) {
    console.error("Error extracting text from file:", error);
    res.status(500).json({ error: "Error extracting text from the file" });
  }
};
