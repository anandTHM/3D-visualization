import { Box, Divider } from "@mui/material";
import LaunchSharpIcon from "@mui/icons-material/LaunchSharp";

const ShowUnitAndFacility = ({ name, onClickHandler , unitsDetails ,  isCommercial = false, isFacility=false }) => (
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
            cursor: "pointer",
            color: "#7E1946",
          }}
          onClick={onClickHandler}
        >
          <LaunchSharpIcon
            fontSize="small"
            sx={{ height: "14px", width: "14px", fontWeight: "400" }}
          />
          <span>
            {isFacility 
              ? "View Details"
              : isCommercial
              ? "View Contracts Details"
              : "View Unit Details"}
          </span>
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

export default ShowUnitAndFacility;
