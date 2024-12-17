// import React from "react";
// import {
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
// } from "@mui/material";
// import moment from "moment";
// import { getStatusColor } from "../../utils/helper";
// import AppLoader from "../../components/AppLoader";
// import { ticketsStatus } from "../../utils/helper";

// const styles = {
//   tableContainer: { border: "1px solid #D6D6D6" },
//   tableHead: { backgroundColor: "#F6F6F6" },
//   tableHeaderCell: { fontWeight: "400", fontSize: "13px", color: "#8C8C8C" },
//   loadingCell: { textAlign: "center", py: 3 },
//   tableRow: { "&:hover": { backgroundColor: "#F6F6F6" } },
//   tableCell: { color: "rgba(0, 0, 0, .87)", fontSize: "13px", py: 1 },
//   chip: (status) => ({
//     backgroundColor: getStatusColor(status),
//     color: "rgba(0, 0, 0, .87)",
//     fontSize: "13px",
//     py: 1,
//   }),
// };

// const CustomTable = ({ tableHeader, tableData, isLoading }) => {
//   return (
//     <TableContainer component={Paper}>
//       <Table
//         size="small"
//         aria-label="custom dense table"
//         sx={styles.tableContainer}
//       >
//         <TableHead sx={styles.tableHead}>
//           <TableRow>
//             {tableHeader.map((header, index) => (
//               <TableCell key={`header-${index}`} sx={styles.tableHeaderCell}>
//                 {header}
//               </TableCell>
//             ))}
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {isLoading ? (
//             <TableRow>
//               <TableCell colSpan={tableHeader.length} sx={styles.loadingCell}>
//                 <AppLoader thickness={4} size={20} color="inherit" />
//               </TableCell>
//             </TableRow>
//           ) : tableData?.length > 0 ? (
//             tableData.map((item, index) => (
//               <TableRow key={`row-${index}`} sx={styles.tableRow}>
//                 <TableCell sx={styles.tableCell}>
//                   {item?.ticketCategory}
//                 </TableCell>
//                 <TableCell>
//                   <TableCell>
//                     {(() => {
//                       const statusInfo = ticketsStatus.find(
//                         (status) => status.value === item?.status
//                       );
//                       return statusInfo ? (
//                         <Chip
//                           label={statusInfo.label}
//                           sx={{
//                             ...styles.chip(statusInfo.value),
//                             backgroundColor: statusInfo.color,
//                           }}
//                         />
//                       ) : null;
//                     })()}
//                   </TableCell>
//                 </TableCell>
//                 <TableCell sx={styles.tableCell}>
//                   {item.createdAt &&
//                     moment(item.createdAt).format("DD MMM YYYY")}
//                 </TableCell>
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={tableHeader.length} sx={styles.loadingCell}>
//                 No data available
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// const Tickets = ({ tickets, isLoading }) => {
//   const TableHeaderForTickets = ["Category", "Status", "Created on"];

//   return (
//     <Box>
//       <CustomTable
//         tableHeader={TableHeaderForTickets}
//         tableData={tickets.slice(0, 5)}
//         isLoading={isLoading}
//       />
//     </Box>
//   );
// };

// export default Tickets;


import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import moment from "moment";
import { getStatusColor } from "../../utils/helper";
import AppLoader from "../../components/AppLoader";
import { ticketsStatus } from "../../utils/helper";

const styles = {
  tableContainer: { border: "1px solid #D6D6D6" },
  tableHead: { backgroundColor: "#F6F6F6" },
  tableHeaderCell: { fontWeight: "400", fontSize: "13px", color: "#8C8C8C" },
  loadingCell: { textAlign: "center", py: 3 },
  tableRow: { "&:hover": { backgroundColor: "#F6F6F6" } },
  tableCell: { color: "rgba(0, 0, 0, .87)", fontSize: "13px", py: 1 },
  chip: (status) => ({
    backgroundColor: getStatusColor(status),
    color: "rgba(0, 0, 0, .87)",
    fontSize: "13px",
    py: 1,
  }),
  categoryCell: {
    color: "rgba(0, 0, 0, .87)",
    fontSize: "13px",
    py: 1,
    maxWidth: "150px", 
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  statusCell: {
    color: "rgba(0, 0, 0, .87)",
    fontSize: "13px",
    py: 1,
  },
  createdAtCell: {
    color: "rgba(0, 0, 0, .87)",
    fontSize: "13px",
    py: 1,
  },
};

const CustomTable = ({ tableHeader, tableData, isLoading }) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="custom dense table" sx={styles.tableContainer}>
        <TableHead sx={styles.tableHead}>
          <TableRow>
            {tableHeader.map((header, index) => (
              <TableCell key={`header-${index}`} sx={styles.tableHeaderCell}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={tableHeader.length} sx={styles.loadingCell}>
                <AppLoader thickness={4} size={20} color="inherit" />
              </TableCell>
            </TableRow>
          ) : tableData?.length > 0 ? (
            tableData.map((item, index) => (
              <TableRow key={`row-${index}`} sx={styles.tableRow}>
                <TableCell sx={styles.categoryCell}>
                  {item?.ticketCategory}
                </TableCell>
                <TableCell sx={styles.statusCell}>
                  {(() => {
                    const statusInfo = ticketsStatus.find(
                      (status) => status.value === item?.status
                    );
                    return statusInfo ? (
                      <Chip
                        label={statusInfo.label}
                        sx={{
                          ...styles.chip(statusInfo.value),
                          backgroundColor: statusInfo.color,
                        }}
                      />
                    ) : null;
                  })()}
                </TableCell>
                <TableCell sx={styles.createdAtCell}>
                  {item.createdAt &&
                    moment(item.createdAt).format("DD MMM YYYY")}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={tableHeader.length} sx={styles.loadingCell}>
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
