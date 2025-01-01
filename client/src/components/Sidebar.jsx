import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Avatar,
  Box,
  Button,
  DialogTitle,
  IconButton,
  Drawer as MuiDrawer,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/authActions";
import { fetchAllChats } from "../api/chatApi";
import MenuItem from "./MenuItem";
import pdfIcon from "../assets/files/pdf.svg";
import pngIcon from "../assets/files/png.svg";
import jpegIcon from "../assets/files/jpeg.svg";
import { useNavigate } from "react-router-dom";

const drawerWidth = 300;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(10)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(11)} + 1px)`,
  },
});

const DrawerHeader = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "20px 0 16px 20px",
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Sidebar() {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(true);
  const [chats, setChats] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetchAllChats(user?.id);
        setChats(response);
      } catch (error) {
        toast.error(error);
      }
    };

    fetchChats();
  }, [user?.id]);

  const logOut = () => {
    dispatch(logout());
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <Button
          onClick={() => navigate("/")}
          variant="outlined"
          startIcon={
            <Icon icon="solar:gallery-add-bold" width="24" height="24" />
          }
        >
          New
        </Button>
        <IconButton
          onClick={open ? handleDrawerClose : handleDrawerOpen}
          size="small"
          sx={{
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box",
            outline: "0px",
            margin: "0px",
            cursor: "pointer",
            userSelect: "none",
            verticalAlign: "middle",
            appearance: "none",
            textDecoration: "none",
            textAlign: "center",
            flex: "0 0 auto",
            borderRadius: "50%",
            overflow: "visible",
            border: "1px solid rgba(145, 158, 171, 0.12)",
            padding: "4px",
            zIndex: 9999,
            position: "fixed",
            top: "24px",
            left: open ? "300px" : "89px",
            transform: "translateX(-50%)",
            transition: "left 0.3s ease",
            "&:hover": {
              backgroundColor: "rgba(145, 158, 171, 0.08)",
            },
          }}
        >
          {open ? (
            <Icon icon="mingcute:left-line" width="16" height="16" />
          ) : (
            <Icon icon="mingcute:right-line" width="16" height="16" />
          )}
        </IconButton>
      </DrawerHeader>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Stack sx={{ mx: open ? 2 : "9px" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            {chats.map((chat, index) => (
              <MenuItem
                key={index}
                linkName={`/${chat._id}`}
                icon={
                  chat.image.contentType === "application/pdf"
                    ? pdfIcon
                    : chat.image.contentType === "image/jpeg"
                    ? jpegIcon
                    : chat.image.contentType === "image/png"
                    ? pngIcon
                    : null
                }
                name={chat.image.name}
                open={open}
              />
            ))}
          </Box>
        </Stack>
        {open && (
          <Stack>
            <Box
              sx={{
                padding: "40px 16px",
                textAlign: "center",
                alignItems: "center",
              }}
            >
              <Avatar
                alt="Avatar logo that the user set for app that uses AI generated QUIZZES/STUDYSETS"
                src="https://assets.minimals.cc/public/assets/images/mock/avatar/avatar-25.webp"
                sx={{
                  width: 60,
                  height: 60,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto",
                  mb: 2,
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
                {user.username}
              </Typography>
              <Typography color="#637381" variant="body2" noWrap sx={{ mb: 2 }}>
                {user.email}
              </Typography>
              <Button
                onClick={logOut}
                sx={{
                  bgcolor: "rgba(255, 86, 48, 0.16)",
                  color: "error.main",
                  "&:hover": {
                    bgcolor: "rgba(255, 86, 48, 0.20)",
                  },
                }}
                startIcon={
                  <Icon icon="eva:log-out-fill" width="24" height="24" />
                }
              >
                Logout
              </Button>
            </Box>
          </Stack>
        )}
      </Box>
    </Drawer>
  );
}
