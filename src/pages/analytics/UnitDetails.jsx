// import React from "react";
// import { Box, CircularProgress } from "@mui/material";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@mui/material";
// import "moment-timezone";
// import moment from "moment";

// import { formatCurrency } from "../../utils/helper";

// const CustomTableForHomeDetails = ({
//   tableHeader = [],
//   tableData = [],
//   isLoading,
//   organizationCurrency,
// }) => {
//   const getDisplayValue = (value) => (value ? value : "--");
//   const normalizedTableData = Array.isArray(tableData)
//     ? tableData
//     : [tableData];

//   return (
//     <TableContainer component={Paper}>
//       <Table
//         size="small"
//         aria-label="custom dense table"
//         sx={{ border: "1px solid #D6D6D6" }}
//       >
//         <TableHead sx={{ backgroundColor: "#F6F6F6" }}>
//           <TableRow>
//             {tableHeader.map((header, index) => (
//               <TableCell
//                 key={`header-${index}`}
//                 sx={{ fontWeight: "400", fontSize: "13px", color: "#8C8C8C" }}
//               >
//                 {header}
//               </TableCell>
//             ))}
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {isLoading ? (
//             <TableRow>
//               <TableCell
//                 colSpan={tableHeader.length}
//                 sx={{ textAlign: "center", py: 3 }}
//               >
//                 <CircularProgress thickness={4} size={20} color="inherit" />
//               </TableCell>
//             </TableRow>
//           ) : normalizedTableData.length > 0 ? (
//             normalizedTableData.map((data, index) => (
//               <TableRow key={`data-${index}`}>
//                 <TableCell
//                   sx={{
//                     color: "rgba(0, 0, 0, .87)",
//                     fontSize: "13px",
//                     py: 1,
//                     maxWidth: "120px",
//                     whiteSpace: "nowrap",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                   }}
//                 >
//                   {getDisplayValue(
//                     (data?.tenancyTerms?.depositFromTenant &&
//                       formatCurrency(
//                         organizationCurrency,
//                         data?.tenancyTerms?.depositFromTenant
//                       )) ||
//                       `${getDisplayValue(data?.firstName)} ${getDisplayValue(
//                         data?.lastName
//                       )}` ||  data?.description
//                   )}
//                 </TableCell>

//                 <TableCell
//                   sx={{
//                     color: "rgba(0, 0, 0, .87)",
//                     fontSize: "13px",
//                     py: 1,
//                     maxWidth: "120px",
//                     whiteSpace: "nowrap",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                   }}
//                 >
//                   {getDisplayValue(
//                     data?.rentItemDetails?.taxName || data?.phoneNumber
//                   )}
//                 </TableCell>

//                 <TableCell
//                   sx={{
//                     color: "rgba(0, 0, 0, .87)",
//                     fontSize: "13px",
//                     py: 1,
//                     maxWidth: "120px",
//                     whiteSpace: "nowrap",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                   }}
//                 >
//                   {getDisplayValue(
//                     (data?.tenancyTerms?.rentFromTenant &&
//                       formatCurrency(
//                         organizationCurrency,
//                         data?.tenancyTerms?.rentFromTenant
//                       )) ||
//                       getDisplayValue(data?.email)
//                   )}
//                 </TableCell>
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={tableHeader.length} align="center">
//                 No data available
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// const UnitData = ({
//   homeDetails,
//   pocDetails,
//   isLoading,
//   homeTenants,
//   organizationTimeZone,
//   organizationCurrency,
//   selectedUnits,
// }) => {
//   const tableHeader = ["Deposit", "Tax", "Total Amount"];
//   const pocTableHeader = ["Name", "Phone Number", "Email"];
//   const serviceTableHeader = ["Services", "Amount", "Total Amount"];
//   const categoryTableHeader = ["Category", "Amount", "Total Amount"];

//   return (
//     <Box sx={{ px: 2, py: 1 }}>
//       <Box sx={{ py: 1, fontSize: "14px", fontWeight: "400" }}>
//         {" "}
//         Customer Details
//       </Box>
//       <Box sx={{}}>
//         <CustomTableForHomeDetails
//           tableHeader={pocTableHeader}
//           tableData={homeTenants}
//           isLoading={isLoading}
//         />
//       </Box>
//       <Box sx={{ py: 1 }}>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Box sx={{ fontSize: "13px", py: 1 }}> Date of move in </Box>
//           {/* <Box sx={{ fontSize: "13px", py: 1 }}>
//             {" "}
//             {homeDetails[0]?.tenancyTerms?.contractPeriodStartDate
//               ? moment(homeDetails[0]?.tenancyTerms?.contractPeriodStartDate)
//                   .tz(organizationTimeZone)
//                   .format("DD MMM YYYY")
//               : "--"}
//           </Box> */}
//           <Box sx={{ fontSize: "13px", py: 1 }}>
//             {" "}
//             {homeDetails?.contractStartDate
//               ? moment(homeDetails?.contractStartDate)
//                   .tz(organizationTimeZone)
//                   .format("DD MMM YYYY")
//               : "--"}
//           </Box>
//         </Box>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Box sx={{ fontSize: "13px" }}> Date of move out </Box>
//           {/* <Box sx={{ fontSize: "13px" }}>
//             {" "}
//             {homeDetails[0]?.tenancyTerms?.contractPeriodEndDate
//               ? moment(homeDetails[0]?.tenancyTerms?.contractPeriodEndDate)
//                   .tz(organizationTimeZone)
//                   .format("DD MMM YYYY")
//               : "--"}
//           </Box> */}
//           <Box sx={{ fontSize: "13px" }}>
//             {" "}
//             {homeDetails?.contractEndDate
//               ? moment(homeDetails?.contractEndDate)
//                   .tz(organizationTimeZone)
//                   .format("DD MMM YYYY")
//               : "--"}
//           </Box>
//         </Box>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Box sx={{ fontSize: "13px", py: 1 }}> Members </Box>
//           {/* <Box sx={{ fontSize: "13px" }}>
//             {" "}
//             {homeDetails[0]?.tenancyTerms?.contractPeriodEndDate
//               ? moment(homeDetails[0]?.tenancyTerms?.contractPeriodEndDate)
//                   .tz(organizationTimeZone)
//                   .format("DD MMM YYYY")
//               : "--"}
//           </Box> */}
//           <Box sx={{ fontSize: "13px" }}>
//             {" "}
//             {homeDetails?.members?.length > 0 ? homeDetails?.members.length : 0}
//           </Box>
//         </Box>
//       </Box>
//       <Box sx={{ py: 1 }}>
//         <CustomTableForHomeDetails
//           tableHeader={categoryTableHeader}
//           // tableData={homeDetails}
//           // isLoading={isLoading}
//           // organizationCurrency={organizationCurrency}
//         />
//       </Box>
//       <Box sx={{ py: 1 }}>
//         <CustomTableForHomeDetails
//           tableHeader={tableHeader}
//           tableData={homeDetails}
//           isLoading={isLoading}
//           organizationCurrency={organizationCurrency}
//         />
//       </Box>
//       <Box sx={{ py: 1 }}>
//         <CustomTableForHomeDetails
//           tableHeader={serviceTableHeader}
//           tableData={homeDetails.addOns}
//           isLoading={isLoading}
//           organizationCurrency={organizationCurrency}
//         />
//       </Box>
//       <Box sx={{ py: 1, fontSize: "14px", fontWeight: "400" }}> POC </Box>
//       <Box sx={{}}>
//         <CustomTableForHomeDetails
//           tableHeader={pocTableHeader}
//           tableData={pocDetails}
//           isLoading={isLoading}
//         />
//       </Box>
//     </Box>
//   );
// };

// export default UnitData;

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
  Typography,
  Divider,
} from "@mui/material";
import moment from "moment";
import "moment-timezone";

import Grid from "@mui/material/Grid2";

import { formatCurrency } from "../../utils/helper";

const getDisplayValue = (value) => (value ? value : "--");

const CustomTableForHomeDetails = ({
  tableHeader = [],
  tableData = [],
  isLoading,
  organizationCurrency,
}) => {
  const normalizedTableData = Array.isArray(tableData)
    ? tableData
    : [tableData];

  const columnWidth = `${100 / tableHeader.length}%`;

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
                key={`header1-${index}`}
                sx={{ fontWeight: "400", fontSize: "13px", color: "#8C8C8C" }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {normalizedTableData.length > 0 ? (
            normalizedTableData.map((data, index) => (
              <TableRow key={`homeDetails-${index}`}>
                <TableCell
                  sx={{
                    color: "rgba(0, 0, 0, .87)",
                    fontSize: "13px",
                    py: 1,
                    maxWidth: "120px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: columnWidth,
                  }}
                >
                  {data?.categoryName || data?.description}{" "}
                  <Box>
                    {" "}
                    {data?.numberOfUnits > 0
                      ? `X ${data?.numberOfUnits}`
                      : ""}{" "}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    color: "rgba(0, 0, 0, .87)",
                    fontSize: "13px",
                    py: 1,
                    maxWidth: "120px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: columnWidth,
                  }}
                >
                  {formatCurrency(
                    organizationCurrency,
                    data?.rent?.defaultPrice.price || data?.amount
                  )}
                </TableCell>
                <TableCell
                  sx={{
                    color: "rgba(0, 0, 0, .87)",
                    fontSize: "13px",
                    py: 1,
                    maxWidth: "120px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: columnWidth,
                  }}
                >
                  {data?.numberOfUnits &&
                    formatCurrency(
                      organizationCurrency,
                      data?.rent?.defaultPrice.price * data?.numberOfUnits ||
                        data?.amount * data?.numberOfUnits
                    )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={tableHeader.length} align="center">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const CustomTableForServices = ({
  tableHeader = [],
  tableData = [],
  isLoading,
  organizationCurrency,
}) => {
  const columnWidth = `${100 / tableHeader.length}%`;

  return (
    <>
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
                  key={`header2-${index}`}
                  sx={{ fontWeight: "400", fontSize: "13px", color: "#8C8C8C" }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.length > 0 ? (
              tableData.map((data, index) => (
                <TableRow key={`service-${index}`}>
                  <TableCell
                    sx={{
                      color: "rgba(0, 0, 0, .87)",
                      fontSize: "13px",
                      py: 1,
                      maxWidth: "120px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: columnWidth,
                    }}
                  >
                    {data?.description}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "rgba(0, 0, 0, .87)",
                      fontSize: "13px",
                      py: 1,
                      maxWidth: "120px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: columnWidth,
                    }}
                  >
                    {formatCurrency(organizationCurrency, data?.amount)}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "rgba(0, 0, 0, .87)",
                      fontSize: "13px",
                      py: 1,
                      maxWidth: "120px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: columnWidth,
                    }}
                  >
                    {formatCurrency(organizationCurrency, data?.netAmount)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={tableHeader.length} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
const CustomTableForPocHomeDetails = ({
  tableHeader = [],
  tableData = [],
  isLoading,
  organizationCurrency,
}) => {
  const normalizedTableData = Array.isArray(tableData)
    ? tableData
    : [tableData];
  const columnWidth = `${120 / tableHeader.length}%`;
  return (
    <>
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
                  key={`header3-${index}`}
                  sx={{ fontWeight: "400", fontSize: "13px", color: "#8C8C8C" }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {normalizedTableData.length > 0 ? (
              normalizedTableData.map((data, index) => (
                <TableRow key={`home-${index}`}>
                  <TableCell
                    sx={{
                      color: "rgba(0, 0, 0, .87)",
                      fontSize: "13px",
                      py: 1,
                      maxWidth: "120px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: columnWidth,
                    }}
                  >
                    {getDisplayValue(data?.firstName)}{" "}
                    {getDisplayValue(data?.lastName)}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "rgba(0, 0, 0, .87)",
                      fontSize: "13px",
                      py: 1,
                      maxWidth: "120px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: columnWidth,
                    }}
                  >
                    {getDisplayValue(data?.phoneNumber)}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "rgba(0, 0, 0, .87)",
                      fontSize: "13px",
                      py: 1,
                      maxWidth: "120px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: columnWidth,
                    }}
                  >
                    {getDisplayValue(data?.email)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={tableHeader.length} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

const CustomTableForDeposits = ({
  tableHeader = [],
  tableData = [],
  isLoading,
  organizationCurrency,
}) => {
  const columnWidth = `${100 / tableHeader.length}%`;

  return (
    <>
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
                  key={`header4-${index}`}
                  sx={{ fontWeight: "400", fontSize: "13px", color: "#8C8C8C" }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.length > 0 ? (
              tableData.map((data, index) => (
                <TableRow key={`deposit-${index}`}>
                  <TableCell
                    sx={{
                      color: "rgba(0, 0, 0, .87)",
                      fontSize: "13px",
                      py: 1,
                      maxWidth: "120px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: columnWidth,
                    }}
                  >
                    {formatCurrency(organizationCurrency, data?.amount)}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "rgba(0, 0, 0, .87)",
                      fontSize: "13px",
                      py: 1,
                      maxWidth: "120px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: columnWidth,
                    }}
                  >
                    {!data.taxable ? data.applicableTax : data.taxName}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "rgba(0, 0, 0, .87)",
                      fontSize: "13px",
                      py: 1,
                      maxWidth: "120px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: columnWidth,
                    }}
                  >
                    {data?.numberOfUnits
                      ? formatCurrency(
                          organizationCurrency,
                          data?.amount * data?.numberOfUnits
                        )
                      : formatCurrency(organizationCurrency, data?.amount)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={tableHeader.length} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

const UnitData = ({
  homeDetails,
  pocDetails,
  isLoading,
  homeTenants,
  organizationTimeZone,
  organizationCurrency,
  loadTransaction,
  totalReceivables,
  totalPayables,
}) => {
  const tableHeaders = {
    default: ["Deposit", "Tax", "Total Amount"],
    poc: ["Name", "Phone Number", "Email"],
    service: ["Services", "Amount", "Total Amount"],
    category: ["Category", "Amount", "Total Amount"],
  };

  const formatDate = (date) =>
    date ? moment(date).tz(organizationTimeZone).format("DD MMM YYYY") : "--";

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "30vh",
        }}
      >
        <AppLoader thickness={5} size={25} color="inherit" />
      </Box>
    );
  }

  const amountData = [
    {
      label: "Total Receivables",
      value: totalReceivables || 0,
      url: "/godview/#/transaction/invoice/filter/none",
    },
    {
      label: "Total Payables",
      value: totalPayables || 0,
      url: "/godview/#/payment/invoice/filter/none",
    },
  ];

  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Box sx={{ py: 1, fontSize: "13px", fontWeight: "400" }}>
        Customer Details
      </Box>
      <CustomTableForPocHomeDetails
        tableHeader={tableHeaders.poc}
        tableData={homeTenants}
        isLoading={isLoading}
      />

      <Box sx={{ py: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ fontSize: "13px", py: 1 }}>Date of move in</Box>
          <Box sx={{ fontSize: "13px", py: 1 }}>
            {formatDate(homeDetails?.contractStartDate)}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ fontSize: "13px" }}>Date of move out</Box>
          <Box sx={{ fontSize: "13px" }}>
            {formatDate(homeDetails?.contractEndDate)}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ fontSize: "13px", py: 1 }}>Members</Box>
          <Box sx={{ fontSize: "13px" }}>
            {homeDetails?.members?.length || 0}
          </Box>
        </Box>
      </Box>

      <>
        <Box sx={{ py: 1 }}>
          <CustomTableForHomeDetails
            tableHeader={tableHeaders.category}
            tableData={
              homeDetails.plans?.length > 0
                ? homeDetails?.plans
                : homeDetails?.rentDetails
            }
            isLoading={isLoading}
            organizationCurrency={organizationCurrency}
          />
        </Box>

        <Box sx={{ py: 1 }}>
          <CustomTableForDeposits
            tableHeader={tableHeaders.default}
            tableData={homeDetails.deposits}
            isLoading={isLoading}
            organizationCurrency={organizationCurrency}
          />
        </Box>

        <Box sx={{ py: 1 }}>
          <CustomTableForServices
            tableHeader={tableHeaders.service}
            tableData={homeDetails.addOns}
            isLoading={isLoading}
            organizationCurrency={organizationCurrency}
          />
        </Box>

        <Box sx={{ py: 1, fontSize: "14px", fontWeight: "400" }}>POC</Box>
        <CustomTableForPocHomeDetails
          tableHeader={tableHeaders.poc}
          tableData={pocDetails}
          isLoading={isLoading}
        />

        <Divider sx={{ py: 1 }} />
        <Box sx={{ py: 1, fontSize: "14px", fontWeight: "400" }}>Accounts</Box>
        {loadTransaction ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "40px",
            }}
          >
            <AppLoader thickness={5} size={20} />
          </Box>
        ) : (
          <Grid container spacing={3} sx={{ position: "relative" }}>
            {amountData.map(({ label, value, url }, index) => (
              <>
                <Grid
                  item
                  size={6}
                  key={label + index}
                  sx={{
                    cursor: "pointer",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                  onClick={() => value && navigateToUrl(url)}
                >
                  <Typography
                    variant="body1"
                    sx={{ color: "#717171", fontSize: "13px" }}
                  >
                    {label}
                  </Typography>
                  <Typography variant="span">
                    {formatCurrency(organizationCurrency, value || 0)}
                  </Typography>
                </Grid>
                {index === 0 && (
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      position: "absolute",
                      height: "100%",
                      left: "40%",
                      transform: "translateX(-50%)",
                    }}
                  />
                )}
              </>
            ))}
          </Grid>
        )}
      </>
    </Box>
  );
};

export default UnitData;
