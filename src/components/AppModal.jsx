import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress } from "@mui/material";
import { useSpace } from "../store";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-60%, -70%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#7E1946",
  color: "#fff",
  padding: "8px 16px",
  fontSize: "16px",
};

const footerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  padding: "12px",
  borderTop: "1px solid #ccc",
};

const descriptionStyle = {
  minHeight: "110px",
  mb: 2,
  color: "#1B1A1A",
};

const AppModal = ({
  open,
  headerText,
  descriptionText,
  primaryButtonText,
  secondaryButtonText,
  onClickPrimaryButton,
  isLoading = false,
  onClickCancelHandler,
  discardButtonText,
  onClickDiscardButton,
}) => {
  const { state } = useSpace();

  return (
    <>
      <Modal
        open={open}
        // onClose={onClickCancelHandler}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={headerStyle}>
            <Typography variant="h6" component="h2" >
              {headerText}
            </Typography>
            <IconButton onClick={onClickCancelHandler} sx={{ color: "#fff" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={descriptionStyle}>
            <Typography
              variant="body1"
              sx={{
                px: 2,
                mt: 1,
                color: "#1B1A1A",
                whiteSpace: "pre-line",
                fontSize: "15px",
              }}
            >
              {descriptionText}
            </Typography>
          </Box>
          <Box sx={footerStyle}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="body1"
                sx={{
                  color: "#000000",
                  cursor: "pointer",
                  mr: 2,
                  fontSize: "14px",
                }}
                onClick={onClickCancelHandler}
              >
                {secondaryButtonText}
              </Typography>
            </Box>
            {discardButtonText && (
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  ml: 2,
                  background: "#F8F8F8",
                  color: "#000000",
                  fontSize: "14px",
                }}
                onClick={onClickDiscardButton}
              >
                {discardButtonText}
              </Button>
            )}
            <Button
              variant="contained"
              color="secondary"
              sx={{
                ml: 2,
                background: "#7E1946",
                color: "#FFFFFF",
                fontSize: "14px",
              }}
              onClick={onClickPrimaryButton}
            >
              {isLoading ? (
                <CircularProgress thickness={5} size={30} color="#FFFFFF" />
              ) : (
                primaryButtonText
              )}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default AppModal;
