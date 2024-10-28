import React from "react";
import { Button } from "@mui/material";
import { theme } from "../utils";

const AppButton = ({
  variant,
  labelText,
  backgroundColor,
  color,
  onClick,
  disabled,
}) => {
  return (
    <Button
      variant={variant || "contained"}
      sx={{
        backgroundColor: backgroundColor || theme.primaryBackgroundColor,
        fontSize: "14px",
        color: color || theme.primaryColor,
        "&:hover": {
          backgroundColor: backgroundColor || theme.primaryBackgroundColor,

          color: color || theme.primaryColor,
          opacity: 1,
        },
      }}
      disabled={disabled}
      onClick={onClick}
    >
      {labelText}
    </Button>
  );
};

export default AppButton;
