import { Box, Divider } from "@mui/material";
import LaunchSharpIcon from "@mui/icons-material/LaunchSharp";

const ShowUnitAndFacility = ({ name, onClickHandler }) => (
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
            fontSize: "14px",
            cursor: "pointer",
            color: "#7E1946",
          }}
          onClick={onClickHandler}
        >
          <LaunchSharpIcon
            fontSize="small"
            sx={{ height: "14px", width: "14px", fontWeight: "400" }}
          />
          <span>View Details</span>
        </Box>
      </Box>
    </Box>
    <Divider sx={{ py: 1 }} />
  </Box>
);

export default ShowUnitAndFacility;
