import { useEffect, useState } from "react";
import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Space from "./Space";
import { useSpace } from "../../store";
import { useDigitalTwin } from "../../store/digitalTwin";
import { get } from "../../service";
import backIcon from "../../assets/backIcon.svg";
import { baseUrl } from "../../utils/helper";
import Facility from "./FacilityDetails";
import UnitData from "./UnitDetails";
import ShowUnitAndFacility from "./ShowUnitandFacility";
import OverView from "./Overview";
import TicketsOverview from "./TicketsOverview";
import AppToolBar from "../../components/AppToolbar";

const DigitalTwin = ({ mapping }) => {
  //=========================================Space Store Store State===============================================================
  const { state: SpaceState, handleSelectedFloor } = useSpace();
  const { authToken, selectedFloor } = SpaceState;

  //=================================================Digital Twin Store State=======================================================
  const {
    state: DigitalTwinState,
    handleProjects,
    handleUnits,
    handleFacilities,
    handleSelectedProjects,
    handleUnitOccupancy,
    handleReceivables,
    handlePayables,
    handleTotalFacility,
    handleTicketsStatus,
    handleTickets,
    handleFacilityBooking,
    handleFacilityDetails,
    handleFacilityUserDetails,
    handleSelectedUnits,
    handleSelectedFacilities,
    handleHomeDetails,
    handlePocDetails,
    handleHomeTenants,
    handleSelectedTab,
    handleTicketsOnSpace,
    handleOnClickStatus,
    handleTicketStatusFilter,
  } = useDigitalTwin();

  const { handleEnterSpaceId, handleFloors } = useSpace();

  const {
    selectedProjects,
    unitOccupancy,
    totalReceivables,
    totalPayables,
    totalFacility,
    ticketsStatus,
    tickets,
    onClickFacility,
    facilityDetails,
    facilityUserDetails,
    organizationTimeZone,
    organizationCurrency,
    homeDetails,
    pocDetails,
    selectedUnits,
    selectedFacilities,
    homeTenants,
    selectedTab,
    ticketStatusFilter,
    ticketsOnSpace,
    facilities,
    units,
  } = DigitalTwinState;

  //============================================ State ==============================================================

  const [loading, setLoading] = useState(false);
  const [loadUnitOccupancy, setLoadUnitOccupancy] = useState(false);
  const [loadTransaction, setLoadTransaction] = useState(false);
  const [loadTotalFacility, setLoadTotalFacility] = useState(false);
  const [loadTicketsStatus, setLoadTicketsStatus] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [loadUnit, setLoadUnit] = useState(false);

  const [facilityDetailsLoading, setFacilityDetailsLoading] = useState(false);

  //===========================================Digital Twin Store Handlers with Functions =======================================================

  const fetchProperties = async () => {
    if (authToken) {
      setLoading(true);
      try {
        const response = await get(
          `/project/search`,
          { limit: 9007199254740991, page: 1 },
          authToken
        );
        if (response && response.data) {
          const transformedProperties = response.data.rows
            ?.filter(
              (item) => item.spaceData?.status && item?.spaceData?.spaceId
            )
            .map((item) => ({
              _id: item?._id,
              name: item?.name,
              spaceData: item?.spaceData,
              contactPoints: item?.contactPoints,
              floors: item?.floors,
            }));

          const floorOptions = Array.from(
            { length: transformedProperties[0]?.spaceData?.floors },
            (_, index) => index
          );
          handleFloors(floorOptions);
          handleSelectedProjects(transformedProperties[0]);
          handleProjects(transformedProperties);
          handleEnterSpaceId(transformedProperties[0]?.spaceData?.spaceId);
        } else {
          console.error("No properties found in the response");
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchPocDetails = async (id) => {
    try {
      const queryParams = {
        fields: ["firstName", "lastName"],
      };
      const response = await get(`/user/${id}`, queryParams, authToken);
      if (response && response.data) {
        const userDetail = {
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber,
        };
        return userDetail;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUnits = async () => {
    try {
      const queryParams = {
        limit: 9007199254740991,
        page: 1,
        projects: selectedProjects._id,
        sort: "-createdAt",
        status: "available",
      };

      const response = await get("/listing", queryParams, authToken);
      if (response && response.data) {
        const transformedProperties = response.data.rows
          .filter((item) => item?.smplrSpaceData?.objectId)
          .map((item) => ({
            _id: item?._id,
            name: item?.unitAddress,
            smplrSpaceData: item?.smplrSpaceData,
            status: item?.occupancyStatus,
          }));

        handleUnits(transformedProperties);
      } else {
        console.error("No properties found in the response");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const fetchFacilities = async () => {
    try {
      const queryParams = {
        limit: 9007199254740991,
        page: 1,
        projects: selectedProjects._id,
        sort: "-createdAt",
        status: "available",
        category: ["Facilities", "Services"],
        status: ["active"],
      };

      const response = await get("/facility", queryParams, authToken);

      if (response && response.data) {
        const transformedProperties = response.data.rows
          .filter((item) => item?.smplrSpaceData?.objectId)
          .map((item) => ({
            _id: item?._id,
            name: item?.name,
            smplrSpaceData: item?.smplrSpaceData,
          }));

        handleFacilities(transformedProperties);
      } else {
        console.error("No properties found in the response");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const fetchUnitOccupancy = async () => {
    setLoadUnitOccupancy(true);
    try {
      const queryParams = {
        projects: selectedProjects._id,
        index: selectedFloor !== null ? selectedFloor : null,
      };

      const response = await get(
        "/stats/Overview/unit-occupancy",
        queryParams,
        authToken
      );
      if (response && response.data) {
        handleUnitOccupancy(response.data);
      } else {
        console.error("No properties found in the response");
      }
    } catch (error) {
      console.error("Error fetchinng unit occupancy:", error);
    } finally {
      setLoadUnitOccupancy(false);
    }
  };
  const fetchTotalReceivables = async () => {
    setLoadTransaction(true);
    try {
      const queryParams = {
        projects: selectedProjects._id,
        type: "receivables",
        index: selectedFloor !== null ? selectedFloor : null,
      };

      const response = await get(
        "/stats/Overview/transaction",
        queryParams,
        authToken
      );
      if (response && response.data) {
        handleReceivables(response.data.totalAmount);
      } else {
        console.error("No properties found in the response");
      }
    } catch (error) {
      console.error("Error fetching trasaction:", error);
    } finally {
      setLoadTransaction(false);
    }
  };

  const fetchTotalFacility = async () => {
    setLoadTotalFacility(true);
    try {
      const queryParams = {
        projects: selectedProjects._id,
        index: selectedFloor !== null ? selectedFloor : null,
      };
      const response = await get(
        "/stats/Overview/facility",
        queryParams,
        authToken
      );
      if (response && response.data) {
        handleTotalFacility(response.data);
      } else {
        console.error("No properties found in the response");
      }
    } catch (error) {
      console.error("Error fetchinng total facility:", error);
    } finally {
      setLoadTotalFacility(false);
    }
  };

  const fetchTicketsStatus = async () => {
    setLoadTicketsStatus(true);
    try {
      const queryParams = {
        projects: selectedProjects._id,
        index: selectedFloor !== null ? selectedFloor : null,
        id: selectedFacilities?._id || selectedUnits?._id || null,
      };
      const response = await get(
        "/stats/Overview/tickets",
        queryParams,
        authToken
      );
      if (response && response.data) {
        handleTicketsStatus(response.data);
      } else {
        console.error("No properties found in the response");
      }
    } catch (error) {
      console.error("Error fetchinng ticket status:", error);
    } finally {
      setLoadTicketsStatus(false);
    }
  };

  const fetchTotalPayables = async () => {
    setLoadTransaction(true);
    try {
      const queryParams = {
        projects: selectedProjects._id,
        type: "payables",
        index: selectedFloor !== null ? selectedFloor : null,
      };

      const response = await get(
        "/stats/Overview/transaction",
        queryParams,
        authToken
      );
      if (response && response?.data) {
        handlePayables(response?.data?.totalAmount || 0);
      } else {
        console.error("No properties found in the response");
      }
    } catch (error) {
      console.error("Error fetching trasaction:", error);
    } finally {
      setLoadTransaction(false);
    }
  };

  // const fetchTickets = async () => {
  //   setIsLoading(true);
  //   try {
  //     const queryParams = {
  //       limit: 9007199254740991,
  //       sort: "-createdAt",
  //       limit: 5,
  //       page: 1,
  //       perRow: 5,
  //       skip: 0,
  //       q: "",
  //       projects: selectedProjects._id,
  //       ticketBelongsTo: ["Project", "Listing", "Home"],
  //     };
  //     const response = await get("/ticket/v2", queryParams, authToken);
  //     if (response && response.data) {
  //       handleTickets(response.data.rows);
  //     } else {
  //       console.error("No properties found in the response");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching tickets:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchTicketsForSpace = async () => {
    setIsLoading(true);
    try {
      const queryParams = {
        status: ["open", "re-open", "on-hold", "in-progress"],
        index: selectedFloor !== null ? selectedFloor : null,
        facilityId: selectedFacilities?._id || "",
        listingId: selectedUnits?._id || "",
      };
      const response = await get(
        `/ticket/getAllUnits/${selectedProjects._id}`,
        queryParams,
        authToken
      );
      const allTickets = response?.data?.flatMap((item) => item.tickets);
      handleTickets(allTickets);
      handleTicketsOnSpace(response?.data);
    } catch (error) {
      console.log("fetching tickets for space error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFacilityBookinDetails = async () => {
    setFacilityDetailsLoading(true);
    try {
      const queryParams = {
        limit: 5,
        page: 1,
        sort: "-createdAt",
        populate: "facilities",
      };

      const response = await get(
        `/facility/${selectedFacilities?._id}/booking-history`,
        queryParams,
        authToken
      );
      if (response && response.data) {
        const userDetailsPromises = response.data.rows?.map((data) =>
          fetchFacilityUserDetails(
            data?.user,
            data?.rate,
            data?.facility?.bookingInfo,
            data?.startDate,
            data?.endDate,
            data?.status
          )
        );

        const allUserDetails = await Promise.all(userDetailsPromises);
        handleFacilityUserDetails(allUserDetails);
      } else {
        console.error("No properties found in the response");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFacilityDetailsLoading(false);
    }
  };

  const fetchFacilityUserDetails = async (
    id,
    rate,
    bookingInfo,
    startDate,
    endDate,
    status
  ) => {
    try {
      const queryParams = {
        fields: ["firstName", "lastName"],
      };
      const response = await get(`/user/${id}`, queryParams, authToken);
      if (response && response.data) {
        const userDetail = {
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          rate: rate,
          bookingInfo: bookingInfo,
          startDate: startDate,
          endDate: endDate,
          status: status,
        };

        return userDetail;
      } else {
        console.error("No properties found in the response");
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const fetchFacilityDetails = async () => {
    try {
      const response = await get(
        `/facility/${selectedFacilities?._id}`,
        {},
        authToken
      );
      if (response && response.data) {
        handleFacilityDetails(response.data);
      } else {
        console.error("No properties found in the response");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchHomeDetails = async () => {
    try {
      setLoadUnit(true);
      const url = `/listing/${selectedUnits?._id}/homes`;
      const queryParams = {
        fields: [
          "_id",
          "listing",
          "tenants",
          "dateOfMoveIn",
          "moveOut",
          "status",
          "owners",
          "createdAt",
          "tenancyTerms",
          "occupancyStatus",
        ],
        limit: 5,
        page: 1,
        status: ["active", "moving-out", "upcoming"],
      };

      const response = await get(url, { params: queryParams }, authToken);

      if (response && response.data) {
        const activeContract = response?.data?.homes.filter(
          (home) => home.status === "active"
        );

        if (activeContract.length > 0) {
          handleHomeDetails(activeContract);

          const tenants = activeContract[0]?.tenants;
          if (tenants && tenants.length > 0) {
            const tenantDetails = await Promise.all(
              tenants.map(async (tenantId) => {
                const tenantData = await fetchTenantsOfActiveHome(tenantId);
                return tenantData;
              })
            );

            handleHomeTenants(tenantDetails);
          } else {
            console.log("No tenants found in the active contract.");
          }
        } else {
          console.error("No active contracts found.");
        }
      } else {
        console.error("No properties found in the response.");
      }
    } catch (error) {
      console.error("Error fetching home details:", error);
    } finally {
      setLoadUnit(false);
    }
  };

  const fetchTenantsOfActiveHome = async (id) => {
    try {
      const queryParams = {
        fields: ["firstName", "lastName"],
      };

      const response = await get(
        `/user/${id}`,
        { params: queryParams },
        authToken
      );

      if (response && response.data) {
        return response.data;
      } else {
        console.log("No tenant details found for id:", id);
      }
    } catch (error) {
      console.error("Error fetching tenant details:", error);
    }
  };

  const handleTabChange = (tab) => {
    handleSelectedTab(tab);
    if (tab === "Tickets") {
      handleOnClickStatus("All");
    } else {
      handleTicketStatusFilter("");
    }
  };

  const onClickBackHandler = () => {
    handleSelectedFloor(null);
    handleSelectedUnits(null);
    handleSelectedFacilities(null);
    handleFacilityBooking([]);
    handleFacilityDetails({});
    handleFacilityUserDetails([]);
    handleHomeTenants([]);
    handleHomeDetails([]);
    handleTicketsOnSpace([]);
    handleSelectedTab("Overview");
    handleOnClickStatus("All");
    handleTicketStatusFilter("");
  };

  //===========================================Effects=============================================================

  useEffect(() => {
    fetchProperties();
  }, [authToken]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (selectedProjects) {
        fetchUnits();
        fetchFacilities();

        if (
          (selectedProjects.contactPoints &&
            selectedProjects.contactPoints.length > 0) ||
          selectedUnits?._id
        ) {
          const pocPromises = selectedProjects.contactPoints.map(async (id) => {
            const userDetail = await fetchPocDetails(id);
            return userDetail;
          });

          const pocDetails = await Promise.all(pocPromises);
          handlePocDetails(pocDetails);
        }
      }
    };

    fetchDetails();
  }, [selectedProjects]);

  useEffect(() => {
    if (selectedProjects) {
      if (
        selectedTab === "Overview" &&
        selectedFacilities === null &&
        selectedUnits === null
      ) {
        fetchUnitOccupancy();
        fetchTotalReceivables();
        fetchTotalFacility();
        fetchTotalPayables();
      }

      if (selectedTab === "Tickets") {
        fetchTicketsStatus();
        // fetchTickets();
        fetchTicketsForSpace();
      }
    }
  }, [
    selectedProjects,
    selectedTab,
    selectedFloor,
    selectedUnits,
    selectedFacilities,
  ]);

  useEffect(() => {
    if (selectedFacilities?._id) {
      fetchFacilityDetails();
      fetchFacilityBookinDetails();
    }
  }, [selectedFacilities]);

  useEffect(() => {
    if (selectedUnits?._id) {
      fetchHomeDetails();
    }
  }, [selectedUnits]);

  const filteredDataBasedOnStatus = ticketStatusFilter
    ? tickets.filter((ticket) => ticket.status === ticketStatusFilter)
    : tickets;

  const renderSpaceDetails = () => {
    return (
      <Box sx={{ flexGrow: 1 }}>
        {selectedProjects && (
          <>
            <Box>
              <Typography
                variant="h4"
                component="h4"
                sx={{
                  color: "#0F0F0F",
                  fontSize: "16px",
                  py: 2,
                  px: 2,
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "400",
                }}
              >
                {(selectedFacilities?._id ||
                  (selectedFloor !== null && selectedFloor !== undefined)) && (
                  <Box
                    sx={{ marginRight: 2, cursor: "pointer" }}
                    onClick={onClickBackHandler}
                  >
                    <img
                      src={backIcon}
                      alt="Back"
                      style={{
                        verticalAlign: "middle",
                        height: "16px",
                        filter:
                          "invert(0%) sepia(100%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)",
                      }}
                    />
                  </Box>
                )}

                {selectedFacilities
                  ? `Facilities - ${selectedProjects?.name}`
                  : selectedFloor !== null && selectedFloor !== undefined
                  ? ` Floor ${selectedFloor + 1} - ${selectedProjects?.name}`
                  : selectedProjects?.name}
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Grid container>
                <Grid
                  item
                  size={6}
                  textAlign={"center"}
                  onClick={() => {
                    handleTicketsOnSpace([]);
                    handleTabChange("Overview");
                  }}
                >
                  <Box
                    sx={{
                      py: 2,
                      px: 2,
                      fontSize: "14px",
                      fontWeight: "400",
                      color: selectedTab === "Overview" ? "#7E1946" : "#8C8C8C",
                      cursor: "pointer",
                      transition: "color 0.3s ease",
                    }}
                  >
                    Overview
                  </Box>
                  <Divider
                    sx={{
                      borderColor: selectedTab === "Overview" && "#7E1946",
                      borderWidth: selectedTab === "Overview" && "1px",
                      transition:
                        "border-color 0.3s ease, border-width 0.3s ease",
                    }}
                  />
                </Grid>
                <Grid
                  item
                  size={6}
                  textAlign={"center"}
                  onClick={() => handleTabChange("Tickets")}
                >
                  <Box
                    sx={{
                      py: 2,
                      px: 2,
                      fontSize: "14px",
                      fontWeight: "400",
                      color: selectedTab === "Tickets" ? "#7E1946" : "#8C8C8C",
                      cursor: "pointer",
                      transition: "color 0.3s ease",
                    }}
                  >
                    Tickets
                  </Box>
                  <Divider
                    sx={{
                      borderColor: selectedTab === "Tickets" && "#7E1946",
                      borderWidth: selectedTab === "Tickets" && "1px",
                      transition:
                        "border-color 0.3s ease, border-width 0.3s ease",
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {selectedTab === "Tickets" ? (
              <>
                {selectedFacilities?._id ? (
                  <ShowUnitAndFacility
                    name={selectedFacilities?.name}
                    onClickHandler={() => {
                      const parentUrl = `${baseUrl}/godview/#/facility-booking/view/${selectedFacilities?._id}`;
                      window.open(parentUrl, "_blank");
                    }}
                  />
                ) : selectedUnits?._id ? (
                  <>
                    <ShowUnitAndFacility
                      name={selectedUnits?.name}
                      onClickHandler={() => {
                        const parentUrl = `${baseUrl}/godview/#/listing/view/${selectedUnits._id}/contract`;
                        window.open(parentUrl, "_blank");
                      }}
                    />
                  </>
                ) : null}
                <Box>
                  <Divider orientation="vertical" />
                  <Box
                    sx={{ py: 2, px: 2, fontSize: "14px", fontWeight: "400" }}
                  >
                    Tickets
                  </Box>
                  {loadTicketsStatus ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100px",
                      }}
                    >
                      <CircularProgress
                        thickness={5}
                        size={30}
                        color="#FFFFFF"
                      />
                    </Box>
                  ) : (
                    <TicketsOverview
                      ticketsStatus={ticketsStatus}
                      tickets={filteredDataBasedOnStatus || []}
                      ticketsOnSpace={ticketsOnSpace}
                      isLoading={isLoading}
                      selectedFacilities={selectedFacilities}
                      selectedUnits={selectedUnits}
                      selectedProjects={selectedProjects}
                    />
                  )}
                </Box>
              </>
            ) : (
              <Box>
                {selectedFacilities?._id ? (
                  <>
                    <ShowUnitAndFacility
                      name={selectedFacilities?.name}
                      onClickHandler={() => {
                        const parentUrl = `${baseUrl}/godview/#/facility-booking/view/${selectedFacilities?._id}`;
                        window.open(parentUrl, "_blank");
                      }}
                    />
                    <Facility
                      facilityDetails={facilityDetails}
                      facilityUserDetails={facilityUserDetails}
                      isLoading={facilityDetailsLoading}
                      onClickFacility={onClickFacility}
                      organizationTimeZone={organizationTimeZone}
                      organizationCurrency={organizationCurrency}
                    />
                  </>
                ) : selectedUnits?._id ? (
                  <>
                    <ShowUnitAndFacility
                      name={selectedUnits?.name}
                      onClickHandler={() => {
                        const parentUrl = `${baseUrl}/godview/#/listing/view/${selectedUnits._id}/contract`;
                        window.open(parentUrl, "_blank");
                      }}
                    />
                    <UnitData
                      homeDetails={homeDetails}
                      pocDetails={pocDetails}
                      homeTenants={homeTenants}
                      isLoading={loadUnit}
                      organizationCurrency={organizationCurrency}
                      organizationTimeZone={organizationTimeZone}
                      selectedUnits={selectedUnits}
                    />
                  </>
                ) : (
                  <OverView
                    unitOccupancy={unitOccupancy}
                    organizationCurrency={organizationCurrency}
                    totalReceivables={totalReceivables}
                    totalPayables={totalPayables}
                    totalFacility={totalFacility}
                    loadUnitOccupancy={loadUnitOccupancy}
                    loadTotalFacility={loadTotalFacility}
                    loadTotalReceivables={loadTransaction}
                    selectedProjects={selectedProjects}
                  />
                )}
              </Box>
            )}
          </>
        )}
      </Box>
    );
  };

  //===========================================Render=============================================================

  return (
    <>
      <AppToolBar mapped={false} />
      <Grid container sx={{ background: "#ffffff" }}>
        {!selectedProjects ? (
          <Grid item size={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "77vh",
              }}
            >
              <CircularProgress thickness={5} size={40} color="#FFFFFF" />
            </Box>
          </Grid>
        ) : (
          <>
            <Grid item size={8.5}>
              <Box sx={{ height: "77vh" }}>
                <Space mapping={mapping} />
              </Box>
            </Grid>
            <Grid item size={3.5}>
              {renderSpaceDetails()}
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default DigitalTwin;
