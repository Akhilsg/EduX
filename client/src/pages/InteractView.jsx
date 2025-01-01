import { Icon } from "@iconify/react/dist/iconify.js";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Dialog,
  dialogClasses,
  Grow,
  IconButton,
  List,
  Slide,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import parse from "html-react-parser";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useNavigate, useParams } from "react-router-dom";
import ResizeObserver from "resize-observer-polyfill";
import { getChatById } from "../api/chatApi";
import chatBotImg from "../assets/chatbot.png";
import { toast } from "../custom";
import LoadingDots from "../custom/LoadingDots";
import { Scrollbar } from "../custom/scrollbar";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const InteractView = () => {
  const { chatId } = useParams();
  const [chat, setChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const chatData = await getChatById(chatId);
        setChat(chatData);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchChat();
  }, [chatId]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        const entry = entries[0];
        setContainerWidth(entry.contentRect.width);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  const handleClose = () => {
    navigate("/");
  };

  const onDocumentLoadSuccess = (numPages) => {
    setNumPages(numPages);
  };

  const renderContent = () => {
    if (!chat) return null;

    if (chat.image.contentType === "application/pdf") {
      return (
        <Box ref={containerRef} sx={{ overflowY: "auto", height: "100%" }}>
          <Document
            file={`data:${chat.image.contentType};base64,${chat.image.data}`}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page
              pageNumber={pageNumber}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              width={containerWidth}
            />
          </Document>
        </Box>
      );
    } else {
      return (
        <Box
          component="img"
          src={`data:${chat.image.contentType};base64,${chat.image.data}`}
          alt="Interactable"
          sx={{ width: "100%", height: "auto", objectFit: "contain" }}
        />
      );
    }
  };

  const scrollToBottom = () => {
    const scrollableNode = document.querySelector(".simplebar-content-wrapper");
    if (scrollableNode) {
      scrollableNode.scrollTo({
        top: scrollableNode.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const scrollableNode = document.querySelector(".simplebar-content-wrapper");
    if (scrollableNode) {
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = scrollableNode;
        setShowScrollButton(scrollHeight - scrollTop > clientHeight + 100);
      };
      scrollableNode.addEventListener("scroll", handleScroll);
      return () => scrollableNode.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <Dialog
      fullScreen
      open={true}
      onClose={handleClose}
      TransitionComponent={Transition}
      sx={{ [`& .${dialogClasses.paper}`]: { borderRadius: 0 } }}
    >
      <AppBar
        position="sticky"
        sx={{ backgroundImage: "none", boxShadow: "none" }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <Icon icon="mdi:close" />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Interact with Image
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex", height: "calc(100% - 64px)" }}>
        <Box
          sx={{
            width: "40%",
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid rgba(0, 0, 0, 0.12)",
            position: "relative",
          }}
        >
          <Scrollbar sx={{ mr: "2px" }}>
            <Box sx={{ overflowY: "auto", maxHeight: "calc(100% - 64px)" }}>
              <List>
                {chat?.messages.map((message, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    justifyContent={
                      message.role === "user" ? "flex-end" : "flex-start"
                    }
                    sx={{ px: 4 }}
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
                            message.role === "user"
                              ? "primary.lighter"
                              : "background.neutral",
                          color:
                            message.role === "user"
                              ? "background.paper"
                              : "#FFFFFF",
                        }}
                      >
                        {message.isLoading ? (
                          <LoadingDots text="EduX is generating" />
                        ) : (
                          <Typography
                            component="div"
                            sx={{
                              fontSize: "0.875rem",
                              ...(message.role === "user" && {
                                fontWeight: 500,
                              }),
                            }}
                          >
                            {parse(message.content)}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </Stack>
                ))}
              </List>
            </Box>
          </Scrollbar>
          {showScrollButton && (
            <Grow in key={showScrollButton}>
              <Button
                onClick={scrollToBottom}
                endIcon={<Icon icon="mdi:chevron-down" />}
                size="large"
                sx={{
                  zIndex: 9999,
                  color: "inherit",
                  bgcolor: "background.paper",
                  position: "absolute",
                  boxShadow:
                    "rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 12px 24px -4px",
                  borderRadius: "12px",
                  bottom: "70px",
                  right: "40%",
                }}
              >
                Scroll to end
              </Button>
            </Grow>
          )}
          <TextField
            fullWidth
            variant="outlined"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton onClick={() => {}}>
                    <Icon icon="mdi:send" />
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
                borderRadius: 0,
                backgroundColor: "background.paper",
                width: "100%",
                padding: "0 12px",
                borderTop: "1.5px solid rgba(145 158 171 / 0.2)",
              },
            }}
          />
        </Box>

        <Box
          component={Scrollbar}
          sx={{
            width: "60%",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflowY: "auto",
          }}
        >
          {renderContent()}
        </Box>
      </Box>
    </Dialog>
  );
};

export default InteractView;
