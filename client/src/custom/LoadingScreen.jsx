import { Box, Portal } from "@mui/material";
import { m } from "framer-motion";
import { Logo } from "./Logo";

const AnimatedLogo = ({ logo, sx, ...other }) => {
  return (
    <Box
      sx={{
        width: 120,
        height: 120,
        alignItems: "center",
        position: "relative",
        display: "inline-flex",
        justifyContent: "center",
        ...sx,
      }}
      {...other}
    >
      <Box
        component={m.div}
        animate={{ scale: [1, 0.9, 0.9, 1, 1], opacity: [1, 0.48, 0.48, 1, 1] }}
        transition={{
          duration: 2,
          repeatDelay: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        sx={{ display: "inline-flex" }}
      >
        <Logo disableLink width={64} height={64} />
      </Box>

      <Box
        component={m.div}
        animate={{
          scale: [1.6, 1, 1, 1.6, 1.6],
          rotate: [270, 0, 0, 270, 270],
          opacity: [0.25, 1, 1, 1, 0.25],
          borderRadius: ["25%", "25%", "50%", "50%", "25%"],
        }}
        transition={{ ease: "linear", duration: 3.2, repeat: Infinity }}
        sx={{
          position: "absolute",
          width: "calc(100% - 20px)",
          height: "calc(100% - 20px)",
          border: "solid 3px rgba(6 59 167 / 0.24)",
        }}
      />

      <Box
        component={m.div}
        animate={{
          scale: [1, 1.2, 1.2, 1, 1],
          rotate: [0, 270, 270, 0, 0],
          opacity: [1, 0.25, 0.25, 0.25, 1],
          borderRadius: ["25%", "25%", "50%", "50%", "25%"],
        }}
        transition={{ ease: "linear", duration: 3.2, repeat: Infinity }}
        sx={{
          width: 1,
          height: 1,
          position: "absolute",
          border: "solid 8px rgba(6 59 167 / 0.24)",
        }}
      />
    </Box>
  );
};

const LoadingScreen = ({ portal = true }) => {
  const content = (
    <Box sx={{ overflow: "hidden" }}>
      <Box
        sx={{
          right: 0,
          width: 1,
          bottom: 0,
          height: 1,
          zIndex: 9998,
          display: "flex",
          position: "fixed",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <AnimatedLogo />
      </Box>
    </Box>
  );

  if (portal) {
    return <Portal>{content}</Portal>;
  }

  return content;
};

export default LoadingScreen;
