import { Box, Divider } from "@mui/material";
import LaunchSharpIcon from "@mui/icons-material/LaunchSharp";

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
    <Box sx={{ px: 2, py: 1 }}>
      <Box sx={{ mt: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ fontSize: "14px", fontWeight: "400" }}>{name}</Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: "13px",
              cursor: isDisabled ? "not-allowed" : "pointer", // Disable pointer cursor when disabled
              color: isDisabled ? "#B0B0B0" : "#7E1946",
            }}
            onClick={!isDisabled ? onClickHandler : undefined} // Disable onClick when isDisabled is true
          >
            <LaunchSharpIcon
              fontSize="small"
              sx={{ height: "14px", width: "14px", fontWeight: "400" }}
            />
            <span>{getViewText()}</span>
          </Box>
        </Box>
        {unitsDetails && (
          <>
            <Box sx={{ mt: 0.5, display: "flex", gap: 1 }}>
              {unitsDetails?.numberOfSeats && (
                <Box sx={{ fontSize: "13px", fontWeight: "400" }}>
                  Seats: {unitsDetails.numberOfSeats}
                </Box>
              )}
              {unitsDetails?.buildUpArea && (
                <Box sx={{ fontSize: "13px", fontWeight: "400" }}>
                  Sft: {unitsDetails.buildUpArea}
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>
      <Divider sx={{ py: 1 }} />
    </Box>
  );
};

export default ShowUnitAndFacility;
