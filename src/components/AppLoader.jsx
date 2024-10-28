import React from "react";
import { CircularProgress } from "@mui/material";

const AppLoader = ({ thickness, size, color }) => {
  return (
    <CircularProgress
      thickness={thickness || 5}
      size={size || 40}
      color={color || "#FFFFFF"}
    />
  );
};

export default AppLoader;
