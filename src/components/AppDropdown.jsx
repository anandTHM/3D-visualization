import React from "react";
import {
  Box,
  IconButton,
  Autocomplete,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const AppDropdown = ({
  labelName,
  minWidth = 200,
  options = [],
  value,
  onChange,
  borderColor = "#D6D6D6",
  searchable = false,
  disabled = false,
  onClearSelectedFloor,
}) => {
  const isEmpty = value === "" || value === null || value === undefined;
  return (
    <Box>
      {searchable ? (
        <Autocomplete
          options={options}
          id="auto-complete"
          autoComplete
          includeInputInList
          disableClearable={disabled}
          value={value}
          onChange={onChange}
          getOptionLabel={(option) => option.name || ""}
          renderInput={(params) => (
            <TextField
              {...params}
              label={labelName}
              variant="standard"
              sx={{
                minWidth,
                "& .MuiInput-underline:before": {
                  borderBottom: `1px solid ${borderColor}`,
                },
                "& .MuiInput-underline:hover:before": {
                  borderBottom: `1px solid ${borderColor}`,
                },
                "& .MuiInput-underline:after": {
                  borderBottom: `1px solid ${borderColor}`,
                },
              }}
              InputLabelProps={{
                style: {
                  fontSize: "14px",
                  color: "#848484",
                  fontWeight: "normal",
                },
              }}
            />
          )}
          renderOption={(props, option) => (
            <li
              {...props}
              key={option._id}
              style={{ fontSize: "14px", fontFamily: "inherit" }}
            >
              {option.name || option}
            </li>
          )}
        />
      ) : (
        <FormControl
          variant="standard"
          sx={{
            minWidth: minWidth,
            "& .MuiInputLabel-root": {
              color: "#848484",
              fontWeight: "normal",
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
          }}
        >
          <InputLabel
            id={`${labelName}-label`}
            sx={{
              fontSize: "14px",
              transform: isEmpty
                ? "translate(0, 24px) scale(1)"
                : "translate(0, -1.5px) scale(0.75)",
              pointerEvents: "none",
              transition: "transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms",
            }}
          >
            {labelName}
          </InputLabel>
          <Select
            labelId={`${labelName}-label`}
            id={`${labelName}-select`}
            value={value}
            onChange={onChange}
            displayEmpty
            renderValue={(selected) => {
              if (isEmpty) return "";
              return `Floor ${Number(selected) + 1}`;
            }}
            sx={{
              paddingRight: "40px",
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                  width: "auto",
                },
              },
            }}
            IconComponent={(props) => (
              <ArrowDropDownIcon
                {...props}
                style={{ position: "absolute", right: "8px", zIndex: 1 }}
              />
            )}
            endAdornment={
              value !== null &&
              value !== undefined &&
              value !== "" && (
                <InputAdornment
                  position="end"
                  sx={{
                    position: "absolute",
                    right: "32px",
                    top: "calc(50% - 12px)",
                  }}
                >
                  <IconButton
                    onClick={onClearSelectedFloor}
                    sx={{ padding: "4px" }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }
          >
            {options.length > 0 ? (
              options.map((item, index) => (
                <MenuItem key={index} value={item} sx={{ fontSize: "14px" }}>
                  Floor {item + 1}
                </MenuItem>
              ))
            ) : (
              <MenuItem sx={{ color: "#848484", fontSize: "14px" }}>
                No Data Found
              </MenuItem>
            )}
          </Select>
        </FormControl>
      )}
    </Box>
  );
};

export default AppDropdown;
