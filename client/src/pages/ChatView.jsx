import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Avatar,
  Box,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import parse from "html-react-parser";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { getChatById, sendChatMessageToGPT } from "../api/chatApi";
import chatBotImg from "../assets/chatbot.png";
import { toast } from "../custom";
import LoadingDots from "../custom/LoadingDots";
import "./lightbox.css";

const ChatView = () => {
  const { chatId } = useParams();
  const [chat, setChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  const fetchChat = useCallback(async () => {
    setLoading(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const chatData = await getChatById(
        chatId,
        abortControllerRef.current.signal
      );
      setChat(chatData);
      setChatMessages(chatData.messages);
    } catch (error) {
      if (error.name !== "AbortError") {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    fetchChat();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;
    const userMessage = newMessage;
    setNewMessage("");

    setChatMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: userMessage },
      { role: "bot", content: "loading", isLoading: true },
    ]);

    try {
      setLoading(true);
      const aiResponse = await sendChatMessageToGPT(userMessage, chatId);

      setChatMessages((prevMessages) =>
        prevMessages.map((msg, index) =>
          index === prevMessages.length - 1
            ? { role: "bot", content: aiResponse }
            : msg
        )
      );
    } catch (error) {
      toast.error(error.message);

      setChatMessages((prevMessages) => prevMessages.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!chat) {
    return (
      <Stack sx={{ flex: "1 1 auto", position: "relative" }}>
        <LinearProgress
          sx={{
            top: 0,
            left: 0,
            width: 1,
            height: 2,
            borderRadius: 0,
            position: "absolute",
          }}
        />
      </Stack>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
      <Box
        sx={{
          flexGrow: 1,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container
          component="main"
          maxWidth="md"
          sx={{ position: "relative", minHeight: "100vh", pb: 2 }}
        >
          <Box
            sx={{
              paddingBottom: "80px",
            }}
          >
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Box
                component="img"
                src={`data:${chat.image.contentType};base64,${chat.image.data}`}
                onClick={handleOpenModal}
                alt="Uploaded file"
                sx={{
                  maxWidth: "100%",
                  maxHeight: "350px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  objectFit: "cover",
                  "&:hover": { opacity: 0.9 },
                }}
              />
            </Box>

            <Box sx={{ marginTop: 4 }}>
              {chatMessages.map((message, index) => (
                <Stack
                  key={index}
                  direction="row"
                  justifyContent={
                    message.role === "user" ? "flex-end" : "flex-start"
                  }
                  sx={{ mb: 5 }}
                >
                  {message.role === "bot" && (
                    <Avatar
                      alt="Bot Avatar"
                      src={chatBotImg}
                      sx={{ mr: 2, width: 48, height: 48 }}
                    />
                  )}
                  <Stack
                    sx={{
                      mb: 3,
                      ml: message.role === "user" ? "auto" : 0,
                      maxWidth: "70%",
                    }}
                  >
                    <Typography
                      noWrap
                      variant="caption"
                      sx={{
                        mb: 1,
                        color: "text.disabled",
                        textAlign: message.role === "user" ? "right" : "left",
                      }}
                    >
                      {message.role === "bot" && "Edux, "}{" "}
                      {moment(message.timestamp).fromNow()}
                    </Typography>

                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor:
                          message.role === "user" ? "#CDE9FD" : "#1C252E",
                        color: message.role === "user" ? "#1C252E" : "#FFFFFF",
                      }}
                    >
                      {message.isLoading ? (
                        <LoadingDots text="EduX is generating" />
                      ) : (
                        <Typography
                          component="div"
                          sx={{ fontSize: "0.875rem" }}
                        >
                          {parse(message.content)}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </Stack>
              ))}

              <div ref={messagesEndRef} />
            </Box>
          </Box>
        </Container>
      </Box>

      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          width: "calc(100% - 300px)",
          left: "250px",
          pb: 4,
        }}
      >
        <Container maxWidth="md">
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
              slotProps={{
                input: {
                  endAdornment: (
                    <IconButton
                      color="iconButton"
                      onClick={handleSendMessage}
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress color="disabled" size={24} />
                      ) : (
                        <Icon icon="mdi:send" width={24} height={24} />
                      )}
                    </IconButton>
                  ),
                },
              }}
              sx={{
                input: {
                  color: "#919EAB",
                  "&::placeholder": {
                    opacity: 1,
                  },
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
                  },
                  borderRadius: 7,
                  backgroundColor: "background.paper",
                  width: "100%",
                  padding: "0 12px",
                },
              }}
            />
          </Stack>
        </Container>
      </Box>

      <Lightbox
        open={openModal}
        close={handleCloseModal}
        slides={[
          {
            src: `data:${chat.image.contentType};base64,${chat.image.data}`,
          },
        ]}
        plugins={[Fullscreen, Zoom]}
        controller={{ closeOnBackdropClick: true }}
        render={{
          iconClose: () => <Icon width={24} icon="carbon:close" />,
          iconZoomIn: () => <Icon width={24} icon="carbon:zoom-in" />,
          iconZoomOut: () => <Icon width={24} icon="carbon:zoom-out" />,
          iconPrev: () => <Icon width={32} icon="carbon:chevron-left" />,
          iconNext: () => <Icon width={32} icon="carbon:chevron-right" />,
          iconExitFullscreen: () => (
            <Icon width={24} icon="carbon:center-to-fit" />
          ),
          iconEnterFullscreen: () => (
            <Icon width={24} icon="carbon:fit-to-screen" />
          ),
        }}
      />
    </Box>
  );
};

export default ChatView;
