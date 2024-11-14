import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

const styles = {
  gridContainer: (isChecked) => ({
    cursor: isChecked ? "pointer" : "default",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      transform: isChecked ? "scale(1.15)" : "none",
    },
  }),
  labelContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: 0.5,
  },
  statusBox: (statusColor) => ({
    width: 12,
    height: 12,
    backgroundColor: statusColor,
    marginRight: 1,
  }),
  labelText: {
    color: "#717171",
    fontSize: "13px",
  },
  valueText: {
    fontSize: "16px",
    color: "#000000",
  },
};

const StatusGrid = ({ label, value, statusColor, onClick }) => {
  const isChecked = value > 0;
  return (
    <Grid
      sx={styles.gridContainer(isChecked)}
      onClick={isChecked ? onClick : undefined}
      size={4}
    >
      <Box sx={styles.labelContainer}>
        {statusColor && <Box sx={styles.statusBox(statusColor)} />}
        <Typography variant="body1" sx={styles.labelText}>
          {label}
        </Typography>
      </Box>
      <Typography variant="body2" sx={styles.valueText}>
        {value || 0}
      </Typography>
    </Grid>
  );
};

export default StatusGrid;
