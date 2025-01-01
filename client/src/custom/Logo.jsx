import { useId, forwardRef } from "react";
import Box from "@mui/material/Box";
import NoSsr from "@mui/material/NoSsr";
import { useTheme } from "@mui/material";
import { RouterLink } from "./router-link";

export const Logo = forwardRef(
  (
    {
      width = 40,
      height = 40,
      disableLink = false,
      className,
      href = "/",
      sx,
      ...other
    },
    ref
  ) => {
    const theme = useTheme();
    const gradientId = useId();
    const PRIMARY_LIGHT = theme.palette.primary.light;
    const PRIMARY_MAIN = theme.palette.primary.main;
    const PRIMARY_DARK = theme.palette.primary.dark;

    const logo = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 512 512"
      >
        <defs>
          <linearGradient
            id={`${gradientId}-1`}
            x1="100%"
            x2="50%"
            y1="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={PRIMARY_DARK} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>

          <linearGradient
            id={`${gradientId}-2`}
            x1="50%"
            x2="50%"
            y1="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={PRIMARY_LIGHT} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>

          <linearGradient
            id={`${gradientId}-3`}
            x1="50%"
            x2="50%"
            y1="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={PRIMARY_LIGHT} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>
        </defs>

        <g fill={PRIMARY_MAIN} fillRule="evenodd" stroke="none" strokeWidth="1">
          <path
            fill={`url(#${`${gradientId}-1`})`}
            d="M50 100h400a40 40 0 0 1 10 10v30a40 40 0 0 1-10 10H50a40 40 0 0 1-10-10v-30a40 40 0 0 1 10-10z"
          />
          <path
            fill={`url(#${`${gradientId}-2`})`}
            d="M50 230h300a40 40 0 0 1 10 10v30a40 40 0 0 1-10 10H50a40 40 0 0 1-10-10v-30a40 40 0 0 1 10-10z"
          />
          <path
            fill={`url(#${`${gradientId}-3`})`}
            d="M50 360h400a40 40 0 0 1 10 10v30a40 40 0 0 1-10 10H50a40 40 0 0 1-10-10v-30a40 40 0 0 1 10-10z"
          />
        </g>
      </svg>
    );

    return (
      <NoSsr
        fallback={
          <Box
            width={width}
            height={height}
            sx={{
              flexShrink: 0,
              display: "inline-flex",
              verticalAlign: "middle",
              ...sx,
            }}
          />
        }
      >
        <Box
          ref={ref}
          component={RouterLink}
          href={href}
          width={width}
          height={height}
          aria-label="logo"
          sx={{
            flexShrink: 0,
            display: "inline-flex",
            verticalAlign: "middle",
            ...(disableLink && { pointerEvents: "none" }),
            ...sx,
          }}
          {...other}
        >
          {logo}
        </Box>
      </NoSsr>
    );
  }
);
