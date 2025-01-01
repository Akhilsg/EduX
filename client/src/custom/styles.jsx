import { Toaster } from "sonner";
import { styled } from "@mui/material";
import { toasterClasses } from "./classes";

export const StyledToaster = styled(Toaster)(({ theme }) => {
  const baseStyles = {
    toastDefault: {
      padding: theme.spacing(1, 1, 1, 1.5),
      boxShadow: "0 8px 16px 0 rgba(0 0 0 / 0.08)",
      color: theme.palette.background.paper,
      backgroundColor: theme.palette.text.primary,
    },
    toastColor: {
      padding: theme.spacing(0.5, 1, 0.5, 0.5),
      boxShadow: "0 8px 16px 0 rgba(0 0 0 / 0.16)",
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.paper,
    },
    toastLoader: {
      padding: theme.spacing(0.5, 1, 0.5, 0.5),
      boxShadow: "0 8px 16px 0 rgba(0 0 0 / 0.16)",
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.paper,
    },
  };

  const loadingStyles = {
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "none",
    transform: "none",
    overflow: "hidden",
    alignItems: "center",
    position: "relative",
    borderRadius: "inherit",
    justifyContent: "center",
    background: theme.palette.background.neutral,
    [`& .${toasterClasses.loadingIcon}`]: {
      zIndex: 9,
      width: 24,
      height: 24,
      borderRadius: "50%",
      animation: "rotate 3s infinite linear",
      background: `conic-gradient(255 255 255 / 0, 99 115 129 / 0.64)`,
    },
    [toasterClasses.loaderVisible]: { display: "flex" },
  };

  return {
    width: 300,
    [`& .${toasterClasses.toast}`]: {
      gap: 12,
      width: "100%",
      minHeight: 52,
      display: "flex",
      borderRadius: 12,
      alignItems: "center",
    },
    [`& .${toasterClasses.content}`]: {
      gap: 0,
      flex: "1 1 auto",
    },
    [`& .${toasterClasses.title}`]: {
      fontSize: theme.typography.subtitle2.fontSize,
    },
    [`& .${toasterClasses.description}`]: {
      ...theme.typography.caption,
      opacity: 0.64,
    },
    [`& .${toasterClasses.actionButton}`]: {},
    [`& .${toasterClasses.cancelButton}`]: {},
    [`& .${toasterClasses.closeButton}`]: {
      top: 0,
      right: 0,
      left: "auto",
      color: "currentColor",
      backgroundColor: "transparent",
      transform: "translate(-6px, 6px)",
      borderColor: "rgba(145 158 171 / 0.16)",
      transition: theme.transitions.create([
        "background-color",
        "border-color",
      ]),
      "&:hover": {
        borderColor: "rgba(145 158 171 / 0.24)",
        backgroundColor: "rgba(145 158 171 / 0.08)",
      },
    },
    [`& .${toasterClasses.icon}`]: {
      margin: 0,
      width: 48,
      height: 48,
      alignItems: "center",
      borderRadius: "inherit",
      justifyContent: "center",
      alignSelf: "flex-start",
      [`& .${toasterClasses.iconSvg}`]: {
        width: 24,
        height: 24,
        fontSize: 0,
      },
    },

    "@keyframes rotate": { to: { transform: "rotate(1turn)" } },

    [`& .${toasterClasses.default}`]: {
      ...baseStyles.toastDefault,
      [`&:has(${toasterClasses.closeBtnVisible})`]: {
        [`& .${toasterClasses.content}`]: {
          paddingRight: 32,
        },
      },
      [`&:has(.${toasterClasses.loader})`]: baseStyles.toastLoader,
      [`&:has(.${toasterClasses.loader})`]: baseStyles.toastLoader,
      [`& .${toasterClasses.loader}`]: loadingStyles,
    },
    [`& .${toasterClasses.error}`]: {
      ...baseStyles.toastColor,
      [`& .${toasterClasses.icon}`]: {
        color: theme.palette.error.main,
        backgroundColor: "rgba(255 86 48 / 0.08)",
      },
    },
    [`& .${toasterClasses.success}`]: {
      ...baseStyles.toastColor,
      [`& .${toasterClasses.icon}`]: {
        color: theme.palette.success.main,
        backgroundColor: "rgba(34 197 94 / 0.08)",
      },
    },
    [`& .${toasterClasses.warning}`]: {
      ...baseStyles.toastColor,
      [`& .${toasterClasses.icon}`]: {
        color: theme.palette.warning.main,
        backgroundColor: "rgba(255 171 0 / 0.08)",
      },
    },
    [`& .${toasterClasses.info}`]: {
      ...baseStyles.toastColor,
      [`& .${toasterClasses.icon}`]: {
        color: theme.palette.info.main,
        backgroundColor: "rgba(0 184 217 / 0.08)",
      },
    },
  };
});
