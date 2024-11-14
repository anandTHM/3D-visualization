import { Box, Divider } from "@mui/material";
import LaunchSharpIcon from "@mui/icons-material/LaunchSharp";
import sqt from "../../assets/sqt.svg";
import seat from "../../assets/seat.svg";

const styles = {
  container: { px: 2, py: 1 },
  header: { mt: 1 },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleText: { fontSize: "14px", fontWeight: "400" },
  actionContainer: (isDisabled) => ({
    display: "flex",
    alignItems: "center",
    gap: 1,
    fontSize: "13px",
    cursor: isDisabled ? "not-allowed" : "pointer",
    color: isDisabled ? "#B0B0B0" : "#7E1946",
  }),
  icon: { height: "14px", width: "14px", fontWeight: "400" },
  detailsContainer: { mt: 0.5, display: "flex", gap: 1 },
  detailText: {
    fontSize: "13px",
    fontWeight: "400",
    display: "flex",
    alignItems: "center",
    gap: 0.5,
  },
  image: { width: "16px", height: "16px" },
  divider: { py: 1 },
};

const ShowUnitAndFacility = ({
  name,
  onClickHandler,
  unitsDetails,
  isCommercial = false,
  isFacility = false,
  isDisabled = false,
}) => {
  const getViewText = () => {
    if (isFacility) return "View Details";
    return isCommercial ? "View Contracts Details" : "View Unit Details";
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Box sx={styles.titleContainer}>
          <Box sx={styles.titleText}>{name}</Box>
          <Box
            sx={styles.actionContainer(isDisabled)}
            onClick={!isDisabled ? onClickHandler : undefined}
          >
            <LaunchSharpIcon fontSize="small" sx={styles.icon} />
            <span>{getViewText()}</span>
          </Box>
        </Box>
        {unitsDetails && (
          <>
            <Box sx={styles.detailsContainer}>
              {unitsDetails?.numberOfSeats && (
                <Box sx={styles.detailText}>
                  <img src={seat} alt="seat" style={styles.image} />
                  Seats: {unitsDetails.numberOfSeats}
                </Box>
              )}
              {unitsDetails?.buildUpArea && (
                <Box sx={styles.detailText}>
                  <img src={sqt} alt="sqt" style={styles.image} />
                  Sft: {unitsDetails.buildUpArea}
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>
      <Divider sx={styles.divider} />
    </Box>
  );
};

export default ShowUnitAndFacility;
