import Grid from "@mui/material/Grid2";
import { Box, Divider, Typography } from "@mui/material";
import StatusGrid from "./StatusGrid";
import { OccupancyStatuses } from "../../utils/helper";
import { formatCurrency } from "../../utils/helper";
import AppLoader from "../../components/AppLoader";
import { baseUrl } from "../../utils/helper";

const styles = {
  container: { py: 2, px: 2, fontSize: "14px", fontWeight: "400" },
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100px",
  },
  accountsLoaderContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "40px",
  },
  gridContainer: { py: 1, px: 2 },
  amountItem: {
    cursor: "pointer",
    transition: "transform 0.2s ease-in-out",
    "&:hover": { transform: "scale(1.1)" },
  },
  facilityItem: (isClickable) => ({
    cursor: isClickable ? "pointer" : "default",
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      transform: isClickable ? "scale(1.05)" : "none",
    },
  }),
  labelText: { color: "#717171", fontSize: "13px" },
};

const OverView = ({
  unitOccupancy,
  organizationCurrency,
  totalReceivables,
  totalPayables,
  totalFacility,
  loadTransaction,
  loadTotalFacility,
  loadUnitOccupancy,
  selectedProjects,
}) => {
  const {
    totalSeats,
    totalOccupiedSeats,
    totalVacantSeats,
    totalUnderNoticeSets
  } = unitOccupancy || {};

  const navigateToUrl = (url) => {
    window.open(`${baseUrl}${url}`, '_blank');
  };

  const OccupancyOverviewData = [
    {
      label: "Total Units",
      value:  totalSeats || 0,
      status: "All",
      url: `/godview/#/contracts/search/all/${selectedProjects?._id}`,
    },
    {
      label: "Occupied",
      value:  totalOccupiedSeats || 0,
      status: "Occupied",
      url: `/godview/#/contracts/search/occupied/${selectedProjects?._id}`,
    },
    {
      label: "Vacant",
      value: totalVacantSeats || 0,
      status: "Vacant",
      url: `/godview/#/contracts/search/vacant/${selectedProjects?._id}`,
    },
    // {
    //   label: "Not Ready",
    //   value: totalNotReadyUnits,
    //   status: "Not Ready",
    //   url: `/godview/#/listing/search/not-ready/${selectedProjects?._id}`,
    // },
    {
      label: "Under Notice",
      value:  totalUnderNoticeSets || 0,
      status: "Under Notice",
      url: `/godview/#/listing/search/under-notice/${selectedProjects?._id}`,
    },
  ];

  const amountData = [
    {
      label: "Total Receivables",
      value: totalReceivables,
      url: "/godview/#/transaction/invoice/filter/none",
    },
    {
      label: "Total Payables",
      value: totalPayables,
      url: "/godview/#/transaction/bill/filter/none",
    },
  ];

  return (
    <Box>
      <Box sx={styles.container}>Units</Box>
      {loadUnitOccupancy ? (
        <Box sx={styles.loaderContainer}>
          <AppLoader thickness={5} size={30} />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={styles.gridContainer}>
            {OccupancyOverviewData?.map(({ label, value, status, url }) => (
              <StatusGrid
                key={label}
                label={label}
                value={value}
                statusColor={
                  OccupancyStatuses.find(
                    (statusObj) => statusObj.label === status
                  )?.color
                }
                onClick={() => navigateToUrl(url)}
              />
            ))}
          </Grid>
          <Divider />

          <Box sx={styles.container}>Accounts</Box>
          {loadTransaction ? (
            <Box sx={styles.accountsLoaderContainer}>
              <AppLoader thickness={5} size={20} />
            </Box>
          ) : (
            <Grid container spacing={3} sx={styles.gridContainer}>
              {amountData.map(({ label, value, url }) => (
                <Grid
                  item
                  size={6}
                  key={label}
                  sx={styles.amountItem}
                  onClick={() => value && navigateToUrl(url)}
                >
                  <Typography variant="body1" sx={styles.labelText}>
                    {label}
                  </Typography>
                  <Typography variant="span">
                    {formatCurrency(organizationCurrency, value || 0)}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          )}

          <Divider />

          <Box sx={styles.container}>Facilities</Box>
          <Grid container spacing={3} sx={styles.gridContainer}>
            <Grid
              item
              size={12}
              sx={styles.facilityItem(totalFacility?.totalFacilityRequestPending > 0)}
              onClick={() =>
                totalFacility?.totalFacilityRequestPending > 0 &&
                navigateToUrl(
                  `/godview/#/facility-booking/filter/${selectedProjects?._id}`
                )
              }
            >
              <Typography variant="body1" sx={styles.labelText}>
                Total Facilities
              </Typography>
              {loadTotalFacility ? (
                <Box sx={styles.accountsLoaderContainer}>
                  <AppLoader thickness={5} size={20} />
                </Box>
              ) : (
                <Typography variant="span">
                  {totalFacility?.totalFacilityRequestPending || 0}
                </Typography>
              )}
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default OverView;
