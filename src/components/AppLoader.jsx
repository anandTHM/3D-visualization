import React from "react";
import { CircularProgress , Box  } from "@mui/material";

const AppLoader = ({ thickness, size, color }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress
        thickness={thickness || 5}
        size={size || 40}
        color={color || "#FFFFFF"}
      />
    </Box>
  );
};

export default AppLoader;
