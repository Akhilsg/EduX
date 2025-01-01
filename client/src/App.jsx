import { Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { domMax, LazyMotion } from "framer-motion";
import React, { lazy, Suspense } from "react";
import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Drawer from "./components/Sidebar";
import { Snackbar } from "./custom";
import LoadingScreen from "./custom/LoadingScreen";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { store } from "./store";
import theme from "./theme/theme";

const LazyDashboard = lazy(() => import("./pages/Dashboard"));
const LazyChatView = lazy(() => import("./pages/ChatView"));
const LazyIneteractView = lazy(() => import("./pages/InteractView"));

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <LazyMotion strict features={domMax}>
          <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <Drawer />
            <Snackbar />
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <LazyDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/:chatId"
                  element={
                    <PrivateRoute>
                      <LazyChatView />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/interact/:chatId"
                  element={
                    <PrivateRoute>
                      <LazyIneteractView />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Suspense>
          </Box>
        </LazyMotion>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
