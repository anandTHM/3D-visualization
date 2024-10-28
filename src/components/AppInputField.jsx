import React from "react";
import { Box, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const AppInputField = ({
  labelText = "Enter Space Id",
  labelFont = "14px",
  value = "",
  onChange,
  showSearchIcon,
  width = "200px",
  borderColor = "#D6D6D6",
}) => {
  return (
    <Box display="flex" alignItems="flex-end">
      {showSearchIcon && (
        <SearchIcon style={{ marginRight: 8, fontSize: 22 }} />
      )}
      <TextField
        id="standard-basic"
        label={labelText}
        variant="standard"
        value={value}
        onChange={onChange}
        sx={{
          width,
          "& .MuiInputLabel-root": {
            color: "#848484",
            fontWeight: "normal",
            fontSize: labelFont,
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#848484",
          },
          "& .MuiInput-underline:before": {
            borderBottom: `1px solid ${borderColor}`,
          },
          "& .MuiInput-underline:hover:before": {
            borderBottom: `1px solid ${borderColor}`,
          },
          "& .MuiInput-underline:after": {
            borderBottom: `2px solid ${borderColor}`,
          },
          "& .MuiInputBase-input": {
            color: "#333", // Adjust input text color
          },
        }}
        InputLabelProps={{
          style: {
            fontSize: labelFont,
            color: "#848484",
            fontWeight: "normal",
          },
        }}
      />
    </Box>
  );
};

export default AppInputField;
