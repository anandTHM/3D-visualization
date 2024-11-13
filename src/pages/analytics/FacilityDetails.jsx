import React, { useEffect, useState, useCallback } from "react";
import { Box, Divider } from "@mui/material";
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

import { capitalizeFirstLetter } from "../../utils/helper";
import { formatCurrency } from "../../utils/helper";
import AppLoader from "../../components/AppLoader";

const FacilityCustomTableForUserDetails = ({
  tableHeader,
  tableData,
  isLoading,
  organizationTimeZone,
  organizationCurrency,
}) => {
  const formatDateTime = (startTime, endTime) => {
    const start = moment(startTime).tz(organizationTimeZone);
    const end = moment(endTime).tz(organizationTimeZone);
    const formattedDate = start.format("DD MMM YYYY");
    const formattedStartTime = start.format("hh:mm A");
    const formattedEndTime = end.format("hh:mm A");

    return (
      <Box>
        <Box>{formattedDate}</Box>
        <Box>{`${formattedStartTime} - ${formattedEndTime}`}</Box>
      </Box>
    );
  };

  const filteredData = tableData?.filter(
    // (item) => item?.status === "pending" || item?.status === "approved"
    (item) => item.status !== "cancelled"
  );

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
          ) : filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{
                    color: "rgba(0, 0, 0, .87)",
                    fontSize: "13px",
                    py: 1,
                    maxWidth: "100px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.firstName}
                </TableCell>
                <TableCell
                  sx={{
                    color: "rgba(0, 0, 0, .87)",
                    fontSize: "13px",
                    py: 1,
                  }}
                >
                  {formatDateTime(item?.startDate, item?.endDate)}
                </TableCell>
                <TableCell
                  sx={{
                    color: "rgba(0, 0, 0, .87)",
                    fontSize: "13px",
                    py: 1,
                  }}
                >
                  {item?.bookingInfo?.rate === 0
                    ? "Free"
                    : formatCurrency(
                        organizationCurrency,
                        item?.bookingInfo?.rate
                      )}
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

const FacilityCustomTable = ({
  tableHeader,
  tableData,
  isLoading,
  organizationTimeZone,
  organizationCurrency,
  availabilityType,
  unitType,
  enablePricingSlabs,
  bookingRate,
}) => {
  const formatTimeRange = (startTime, endTime) => {
    const start = moment(startTime).tz(organizationTimeZone);
    const end = moment(endTime).tz(organizationTimeZone);
    const formattedStartTime = start.format("hh:mm A");
    const formattedEndTime = end.format("hh:mm A");

    return `${formattedStartTime} to ${formattedEndTime}`;
  };

  const renderRatePackages = (ratePackages) => {
    return ratePackages?.map((item, index) => (
      <TableRow key={`rate-package-${index}`}>
        <TableCell
          sx={{ color: "rgba(0, 0, 0, .87)", fontSize: "13px", py: 1.5 }}
        >
          {formatCurrency(organizationCurrency, item?.cost)}/ {item?.hours}{" "}
          hours
        </TableCell>
      </TableRow>
    ));
  };

  const renderTableRows = () => {
    if (availabilityType === "weekly") {
      return Object.entries(tableData).map(
        ([day, data], index) =>
          data.available && (
            <TableRow key={`row-${index}`}>
              <TableCell
                sx={{ color: "rgba(0, 0, 0, .87)", fontSize: "13px", py: 1 }}
              >
                {data.rate === 0
                  ? "Free"
                  : `${
                      day.charAt(0).toUpperCase() + day.slice(1)
                    } - ${formatTimeRange(
                      data.workHourStartTime,
                      data.workHourEndTime
                    )}`}
              </TableCell>
            </TableRow>
          )
      );
    } else if (availabilityType === "custom") {
      return tableData.map((data, index) => (
        <TableRow key={`row-${index}`}>
          <TableCell
            sx={{ color: "rgba(0, 0, 0, .87)", fontSize: "13px", py: 1 }}
          >
            {data.rate === 0
              ? "Free"
              : `${moment(data.date).format("DD-MM-YYYY")} - ${formatTimeRange(
                  data.workHourStartTime,
                  data.workHourEndTime
                )}`}
          </TableCell>
        </TableRow>
      ));
    } else if (availabilityType === "daily") {
      return (
        <TableRow>
          <TableCell
            sx={{ color: "rgba(0, 0, 0, .87)", fontSize: "13px", py: 1 }}
          >
            {tableData.rate === 0
              ? "Free Facility"
              : `Daily - ${formatTimeRange(
                  tableData.startTime,
                  tableData.endTime
                )}`}
          </TableCell>
        </TableRow>
      );
    } else if (unitType === "flexible") {
      if (enablePricingSlabs) {
        return (
          <>
            <TableRow>
              <TableCell
                sx={{ color: "rgba(0, 0, 0, .87)", fontSize: "13px", py: 1 }}
              >
                {formatCurrency(organizationCurrency, bookingRate)}/ hour
              </TableCell>
            </TableRow>
            {renderRatePackages(tableData)}
          </>
        );
      } else {
        return (
          <TableRow>
            <TableCell
              sx={{ color: "rgba(0, 0, 0, .87)", fontSize: "13px", py: 1 }}
            >
              {formatCurrency(organizationCurrency, bookingRate)}/ hour
            </TableCell>
          </TableRow>
        );
      }
    } else {
      return (
        <TableRow>
          <TableCell
            sx={{ color: "rgba(0, 0, 0, .87)", fontSize: "13px", py: 1 }}
          >
            {tableData}
          </TableCell>
        </TableRow>
      );
    }
  };

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
          ) : (
            renderTableRows()
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Facility = ({
  facilityDetails,
  isLoading,
  facilityUserDetails,
  organizationTimeZone,
  organizationCurrency,
}) => {
  const getAvailabilityData = () => {
    const {
      availabilityOptions,
      availableDates,
      weekDays,
      workHourStartTime,
      workHourEndTime,
    } = facilityDetails?.bookingInfo || {};

    switch (availabilityOptions) {
      case "custom":
        return { data: availableDates || [], type: "custom" };
      case "daily":
        return {
          data: { startTime: workHourStartTime, endTime: workHourEndTime },
          type: "daily",
        };
      case "weekly":
        return { data: weekDays || {}, type: "weekly" };
      default:
        return { data: [], type: "unknown" };
    }
  };

  const { data: availabilityData, type: availabilityType } =
    getAvailabilityData();

  const bookingRate = facilityDetails?.bookingInfo?.rate || 0;
  const unitType = facilityDetails?.bookingInfo?.unit || "hours";
  const enablePricingSlabs =
    facilityDetails?.bookingInfo?.enablePricingSlabs || false;
  const bookingRateData =
    bookingRate === 0
      ? "Free"
      : unitType === "flexible"
      ? enablePricingSlabs
        ? facilityDetails?.bookingInfo?.ratePackages || []
        : []
      : `${formatCurrency(organizationCurrency, bookingRate)}/${unitType}`;

  // =========================== Table Headers ===========================
  const availabilityOptions =
    facilityDetails?.bookingInfo?.availabilityOptions || " daily";
  const availabilityHeaders =
    availabilityOptions === "daily"
      ? ["Availability"]
      : [`Availability: ${capitalizeFirstLetter(availabilityOptions)}`];
  const bookingRateHeaders = ["Booking Rate"];
  const bookedByHeaders = ["Booked By", "Date & Time", "Amount"];
  // =========================== Table Headers ===========================

  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Box sx={{ mt: 1 }}>
        <FacilityCustomTable
          tableHeader={availabilityHeaders}
          tableData={availabilityData}
          isLoading={isLoading}
          organizationTimeZone={organizationTimeZone}
          availabilityType={availabilityType}
        />
      </Box>
      <Box sx={{ mt: 2 }}>
        <FacilityCustomTable
          tableHeader={bookingRateHeaders}
          tableData={bookingRateData}
          isLoading={isLoading}
          unitType={unitType}
          organizationCurrency={organizationCurrency}
          enablePricingSlabs={enablePricingSlabs}
          bookingRate={bookingRate}
        />
      </Box>
      <Divider />
      <Box sx={{ mt: 1, py: 1, fontSize: "13px" }}> Bookings </Box>
      <Box sx={{ mt: 1 }}>
        <FacilityCustomTableForUserDetails
          tableHeader={bookedByHeaders}
          tableData={facilityUserDetails}
          isLoading={isLoading}
          organizationTimeZone={organizationTimeZone}
          organizationCurrency={organizationCurrency}
        />
      </Box>
    </Box>
  );
};

export default Facility;
