import React from "react";
import { Box, Typography, Button } from "@mui/material";

const AppErrorMessage = ({ message = "An error occurred", onClose }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 24,
        right: 24,
        backgroundColor: "#1c1c1c",
        color: "white",
        padding: "16px 24px",
        borderRadius: 1,
        display: "flex",
        alignItems: "center",
        gap: 2,
        boxShadow: 3,
        zIndex: 2000,
      }}
    >
      <Typography>{message}</Typography>
      <Button
        onClick={onClose}
        sx={{
          color: "white",
          marginLeft: 2,
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
        }}
      >
        OK
      </Button>
    </Box>
  );
};

export default AppErrorMessage;
