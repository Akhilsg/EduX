import axios from "axios";

const OPENAI_URL = "http://localhost:8080/api/openai";

export const sendChatMessageToGPT = async (message, chatId) => {
  try {
    const response = await axios.post(`${OPENAI_URL}/send-chat-message`, {
      message,
      chatId,
    });
    return response.data.response;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("Error communicating with OpenAI");
    }
  }
};

export const getPDFOptionsFromGPT = async (chatId) => {
  try {
    const response = await axios.get(`${OPENAI_URL}/get-pdf-options/${chatId}`);
    return response.data.options;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("Error generating options from GPT");
    }
  }
};

export const fetchAllChats = async () => {
  try {
    const response = await axios.get(`${OPENAI_URL}/chats`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching chats");
  }
};

export const getChatById = async (chatId) => {
  try {
    const response = await axios.get(`${OPENAI_URL}/chat/${chatId}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching chat");
  }
};
