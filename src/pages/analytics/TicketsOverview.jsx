import Grid from "@mui/material/Grid2";
import { Button, Typography, Divider } from "@mui/material";
import Tickets from "./TicketsDetails";
import { baseUrl } from "../../utils/helper";

const TicketsOverview = ({
  ticketsStatus,
  ticketsOnSpace,
  tickets,
  isLoading,
  selectedFacilities,
  selectedUnits,
  selectedProjects,
}) => {
  const { openTickets, inProgressTickets, onHoldTickets, reopenedTickets } =
    ticketsStatus;

  return (
    <Grid container alignItems="center" sx={{ py: 1, px: 2 }}>
      <Grid
        item
        xs={3}
        container
        direction="column"
        alignItems="center"
        sx={{
          cursor: openTickets ? "pointer" : "default",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: openTickets > 0 ? "scale(1.15)" : "none",
          },
        }}
        onClick={() => {
          const parentUrl = `${baseUrl}/godview/#/ticket/${"open"}/${
            selectedProjects?._id
          }`;
          // window.parent.location.href = parentUrl;
          openTickets && window.open(parentUrl, "_blank");
        }}
      >
        <Typography variant="body1" sx={{ color: "#717171", fontSize: "13px" }}>
          Open
        </Typography>
        <Typography variant="span">{openTickets || 0}</Typography>
      </Grid>
      <Grid item size={1}>
        <Divider orientation="vertical" variant="middle" flexItem />
      </Grid>
      <Grid
        item
        size={3}
        container
        direction="column"
        alignItems="center"
        sx={{
          cursor: inProgressTickets ? "pointer" : "default",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: inProgressTickets > 0 ? "scale(1.15)" : "none",
          },
        }}
        onClick={() => {
          const parentUrl = `${baseUrl}/godview/#/ticket/${"in-progress"}/${
            selectedProjects?._id
          }`;
          // window.parent.location.href = parentUrl;
          inProgressTickets && window.open(parentUrl, "_blank");
        }}
      >
        <Typography variant="body1" sx={{ color: "#717171", fontSize: "13px" }}>
          In-Progress
        </Typography>
        <Typography variant="span">{inProgressTickets || 0}</Typography>
      </Grid>
      <Grid item size={1}>
        <Divider orientation="vertical" />
      </Grid>
      <Grid
        item={3}
        container
        direction="column"
        alignItems="center"
        sx={{
          cursor: reopenedTickets ? "pointer" : "default",

          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: inProgressTickets > 0 ? "scale(1.15)" : "none",
          },
        }}
        onClick={() => {
          const parentUrl = `${baseUrl}/godview/#/ticket/${"re-open"}/${
            selectedProjects?._id
          }`;
          // window.parent.location.href = parentUrl;
          reopenedTickets && window.open(parentUrl, "_blank");
        }}
      >
        <Typography variant="body1" sx={{ color: "#717171", fontSize: "13px" }}>
          Re-Open
        </Typography>
        <Typography variant="span">{reopenedTickets || 0}</Typography>
      </Grid>
      <Grid item size={1}>
        <Divider orientation="vertical" />
      </Grid>
      <Grid
        item
        size={3}
        container
        direction="column"
        alignItems="center"
        sx={{
          cursor: onHoldTickets ? "pointer" : "default",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: onHoldTickets > 0 ? "scale(1.15)" : "none",
          },
        }}
        onClick={() => {
          const parentUrl = `${baseUrl}/godview/#/ticket/${"on-hold"}/${
            selectedProjects?._id
          }`;
          // window.parent.location.href = parentUrl;
          onHoldTickets && window.open(parentUrl, "_blank");
        }}
      >
        <Typography variant="body1" sx={{ color: "#717171", fontSize: "13px" }}>
          On-Hold
        </Typography>
        <Typography variant="span">{onHoldTickets || 0}</Typography>
      </Grid>
      <Grid item size={12} sx={{ py: 2 }}>
        <Divider />
      </Grid>
      <Grid size={12}>
        <Tickets tickets={tickets || []} isLoading={isLoading} />
      </Grid>
      <Grid size={3} sx={{ mt: 1 }}>
        {tickets.length > 5 && (
          <Button
            variant="text"
            sx={{
              color: "#7E1946",
              fontSize: "14px",
              fontWeight: "400",
              py: 1.5,
              cursor: "pointer",
              textTransform: "none",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: tickets.length > 0 ? "scale(1.15)" : "none",
              },
            }}
            onClick={() => {
              const parentUrl = `${baseUrl}/godview/#/ticket/filter/none`;
              window.parent.location.href = parentUrl;
            }}
          >
            View More
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default TicketsOverview;
