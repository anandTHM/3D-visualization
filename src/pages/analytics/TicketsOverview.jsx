import Grid from "@mui/material/Grid2";
import { Button, Typography, Divider } from "@mui/material";
import Tickets from "./TicketsDetails";
import { baseUrl } from "../../utils/helper";

const TicketStatusCard = ({ status, count, projectId, label }) => {
  const handleClick = () => {
    if (count > 0) {
      const parentUrl = `${baseUrl}/godview/#/ticket/${status}/${projectId}`;
      window.open(parentUrl, "_blank");
    }
  };

  return (
    <Grid
      item
      xs={3}
      container
      direction="column"
      alignItems="center"
      sx={{
        cursor: count > 0 ? "pointer" : "default",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: count > 0 ? "scale(1.15)" : "none",
        },
        marginRight: 2,
      }}
      onClick={handleClick}
    >
      <Typography variant="body1" sx={{ color: "#717171", fontSize: "13px" }}>
        {label}
      </Typography>
      <Typography variant="span">{count || 0}</Typography>
    </Grid>
  );
};

const TicketsOverview = ({
  ticketsStatus,
  tickets,
  isLoading,
  selectedProjects,
}) => {
  const { openTickets, inProgressTickets, onHoldTickets, reopenedTickets } =
    ticketsStatus;

  return (
    <Grid container alignItems="center" sx={{ py: 1, px: 2 }}>
      <TicketStatusCard
        status="open"
        count={openTickets}
        projectId={selectedProjects?._id}
        label="Open"
      />
      <Grid item size={1}>
        <Divider orientation="vertical" variant="middle" flexItem />
      </Grid>
      <TicketStatusCard
        status="in-progress"
        count={inProgressTickets}
        projectId={selectedProjects?._id}
        label="In-Progress"
      />
      <Grid item size={1}>
        <Divider orientation="vertical" />
      </Grid>
      <TicketStatusCard
        status="re-open"
        count={reopenedTickets}
        projectId={selectedProjects?._id}
        label="Re-Open"
      />
      <Grid item size={1}>
        <Divider orientation="vertical" />
      </Grid>
      <TicketStatusCard
        status="on-hold"
        count={onHoldTickets}
        projectId={selectedProjects?._id}
        label="On-Hold"
      />
      <Grid item size={12} sx={{ py: 2 }}>
        <Divider />
      </Grid>
      <Grid size={12}>
        <Tickets tickets={tickets || []} isLoading={isLoading} />
      </Grid>
      {tickets.length > 5 && (
        <Grid size={3} sx={{ mt: 1 }}>
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
              const parentUrl = `${baseUrl}/godview/#/ticket/filter/${selectedProjects?._id}`;
              window.open(parentUrl, "_blank");
            }}
          >
            View More
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

export default TicketsOverview;
