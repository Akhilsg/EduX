import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/authActions";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/login.png";

const LoginPage = () => {
  const { error, isAuthenticated } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Box
      sx={{
        margin: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        minHeight: "100vh",
      }}
    >
      <Card
        sx={{
          display: "flex",
          maxWidth: { lg: "55%", md: "85%" },
        }}
      >
        <form onSubmit={handleLogin} noValidate>
          <CardContent sx={{ flex: "1 0 auto", padding: 3 }}>
            <Box sx={{ mt: 1 }}>
              <Typography component="h1" variant="h5">
                Login
              </Typography>
              {error && <Typography color="error">{error}</Typography>}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mt: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button type="submit" variant="contained">
                Login
              </Button>
            </Box>
          </CardContent>
        </form>
        <CardMedia
          component="img"
          sx={{ width: 400, display: { md: "block", xs: "none" } }}
          image={loginImage}
          alt="login to your account"
        />
      </Card>
    </Box>
  );
};

export default LoginPage;
