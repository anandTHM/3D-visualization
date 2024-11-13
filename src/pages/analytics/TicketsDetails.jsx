import React from "react";
import { Box } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import "moment-timezone";
import moment from "moment";
import { Chip } from "@mui/material";
import { getStatusColor } from "../../utils/helper";
import { useDigitalTwin } from "../../store/digitalTwin";
import AppLoader from "../../components/AppLoader";

const CustomTable = ({ tableHeader, tableData, isLoading }) => {
  return (
    <TableContainer component={Paper}>
      <Table
        size="small"
        aria-label="custom dense table"
        sx={{ border: "1px solid #D6D6D6" }}
      >
        <TableHead sx={{ backgroundColor: "#F6F6F6" }}>
          <TableRow>
            {tableHeader.map((header, index) => (
              <TableCell
                key={`header-${index}`}
                sx={{ fontWeight: "400", fontSize: "13px", color: "#8C8C8C" }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={tableHeader.length}
                sx={{ textAlign: "center", py: 3 }}
              >
                <AppLoader thickness={4} size={20} color="inherit" />
              </TableCell>
            </TableRow>
          ) : tableData?.length > 0 ? (
            tableData.map((item, index) => (
              <TableRow
                key={`row-${index}`}
                sx={{
                  "&:hover": {
                    backgroundColor: "#F6F6F6",
                  },
                }}
              >
                <TableCell
                  sx={{
                    color: "rgba(0, 0, 0, .87)",
                    fontSize: "13px",
                    py: 1,
                  }}
                >
                  {item?.ticketCategory}
                </TableCell>
                <TableCell>
                  <Chip
                    label={item?.status}
                    sx={{
                      backgroundColor: getStatusColor(item?.status),
                      color: "rgba(0, 0, 0, .87)",
                      fontSize: "13px",
                      py: 1,
                    }}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    color: "rgba(0, 0, 0, .87)",
                    fontSize: "13px",
                    py: 1,
                  }}
                >
                  {item.createdAt &&
                    moment(item.createdAt).format("DD MMM YYYY")}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={tableHeader.length}
                sx={{ textAlign: "center", py: 3 }}
              >
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Tickets = ({ tickets, isLoading }) => {
  const TableHeaderForTickets = ["Category", "Status", "Created on"];

  return (
    <Box>
      <CustomTable
        tableHeader={TableHeaderForTickets}
        tableData={tickets.slice(0, 5)}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default Tickets;
