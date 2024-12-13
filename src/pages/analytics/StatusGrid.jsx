import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

const styles = {
  gridContainer: (isChecked, selectedFloor) => ({
    cursor: (isChecked && selectedFloor === null) ? "pointer" : "default",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    transition: (selectedFloor === null && isChecked) ? "transform 0.2s ease-in-out" : "none",
    "&:hover": {
      transform: (isChecked && selectedFloor === null) ? "scale(1.15)" : "none",
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

const StatusGrid = ({ label, value, statusColor, onClick, selectedFloor }) => {
  const isChecked = value > 0;
  return (
    <Grid
      sx={styles.gridContainer(isChecked, selectedFloor)}
      onClick={(isChecked && selectedFloor === null) ? onClick : undefined}
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