import React from "react";
import { CircularProgress } from "@mui/material";

const AppLoader = ({ thickness, size, color }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: 5,
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
