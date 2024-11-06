import Grid from "@mui/material/Grid2";
import { Button, Typography, Divider, Box, Paper } from "@mui/material";
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
  const {
    openTickets = 0,
    inProgressTickets = 0,
    onHoldTickets = 0,
    reopenedTickets = 0,
  } = ticketsStatus || {};

  const ticketTypes = [
    { label: "Open", count: openTickets, path: "open" },
    { label: "In-Progress", count: inProgressTickets, path: "in-progress" },
    { label: "Re-Open", count: reopenedTickets, path: "re-open" },
    { label: "On-Hold", count: onHoldTickets, path: "on-hold" },
  ];

  return (
    <Paper elevation={0} sx={{ px: 2 }}>
      <Grid container spacing={0} alignItems="center">
        {ticketTypes.map((ticket, index) => (
          <Grid
            item
            size={3}
            key={ticket.path}
            sx={{
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: ticket.count > 0 ? "pointer" : "default",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: ticket.count > 0 ? "scale(1.15)" : "none",
                },
                py: 1,
              }}
              onClick={() => {
                if (ticket.count > 0) {
                  const parentUrl = `${baseUrl}/godview/#/ticket/${ticket.path}/${selectedProjects?._id}`;
                  window.open(parentUrl, "_blank");
                }
              }}
            >
              <Typography
                variant="body1"
                sx={{ color: "#717171", fontSize: "13px" }}
              >
                {ticket.label}
              </Typography>
              <Typography variant="span">{ticket.count || 0}</Typography>
            </Box>

            {index < ticketTypes.length - 1 && (
              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  position: "absolute",
                  right: 0,
                  height: "70%",
                  top: "15%",
                }}
              />
            )}
          </Grid>
        ))}

        <Grid item size={12} sx={{ my: 1.5 }}>
          <Divider />
        </Grid>

        <Grid item size={12}>
          <Tickets tickets={tickets || []} isLoading={isLoading} />
        </Grid>

        {tickets.length > 5 && (
          <Grid
            item
            xs={12}
            sx={{ mt: 1, display: "flex", justifyContent: "center" }}
          >
            <Button
              variant="text"
              sx={{
                color: "#7E1946",
                fontSize: "14px",
                fontWeight: 400,
                py: 1.5,
                textTransform: "none",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.15)",
                  backgroundColor: "transparent",
                },
              }}
              onClick={() => {
                const parentUrl = `${baseUrl}/godview/#/ticket/filter/none`;
                window.parent.location.href = parentUrl;
              }}
            >
              View More
            </Button>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default TicketsOverview;