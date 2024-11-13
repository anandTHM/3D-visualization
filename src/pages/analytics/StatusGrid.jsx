import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

const StatusGrid = ({ label, value, statusColor, onClick }) => (
  <Grid
    sx={{
      cursor: value > 0 ? "pointer" : "default",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      transition: "transform 0.2s ease-in-out",
      "&:hover": {
        transform: value > 0 ? "scale(1.15)" : "none",
      },
    }}
    onClick={value && onClick}
    size={4}
  >
    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 0.5 }}>
      {statusColor && (
        <Box
          sx={{
            width: 12,
            height: 12,
            backgroundColor: statusColor,
            marginRight: 1,
          }}
        />
      )}
      <Typography variant="body1" sx={{ color: "#717171", fontSize: "13px" }}>
        {label}
      </Typography>
    </Box>
    <Typography variant="body2" sx={{ fontSize: "16px", color: "#000000" }}>
      {value || 0}
    </Typography>
  </Grid>
);

export default StatusGrid;
