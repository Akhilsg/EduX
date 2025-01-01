import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, ButtonBase, Tooltip, Typography } from "@mui/material";
import { FastAverageColor } from "fast-average-color";

const MenuItem = ({ open, linkName, icon, name }) => {
  const navigate = useNavigate();
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [iconColor, setIconColor] = useState(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      setIsOverflowing(
        textRef.current.scrollWidth > textRef.current.clientWidth
      );
    }
  }, [name, open]);

  useEffect(() => {
    if (icon) {
      const fac = new FastAverageColor();
      fac
        .getColorAsync(icon)
        .then((color) => {
          setIconColor(color.hex);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [icon]);

  const content = (
    <Link to={linkName} style={{ textDecoration: "none", color: "inherit" }}>
      <ButtonBase
        sx={{
          display: "flex",
          ...(!open && {
            flexDirection: "column",
            px: 2,
          }),
          cursor: "pointer",
          justifyContent: "start",
          width: "100%",
          backgroundColor:
            window.location.pathname === linkName
              ? `${iconColor}14`
              : "transparent",
          padding: 1.5,
          borderRadius: "8px",
          color:
            window.location.pathname === linkName
              ? iconColor
              : "rgb(145, 158, 171)",
          fontSize: open ? "0.875rem" : "0.625rem",
          minHeight: "44px",
          "&:hover": {
            backgroundColor:
              window.location.pathname === linkName
                ? `${iconColor}29`
                : "rgba(145, 158, 171, 0.08)",
          },
        }}
      >
        <Box
          component="img"
          src={icon}
          sx={{
            width: "24px",
            height: "24px",
            mr: open && 1.5,
            display: "inline-flex",
          }}
        />
        <Typography
          ref={textRef}
          sx={{
            fontWeight: window.location.pathname === linkName ? 600 : 500,
            fontSize: open ? "0.875rem" : "0.625rem",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {name}
        </Typography>
      </ButtonBase>
    </Link>
  );

  return isOverflowing && open ? (
    <Tooltip title={name} placement="right">
      {content}
    </Tooltip>
  ) : (
    content
  );
};

export default MenuItem;
