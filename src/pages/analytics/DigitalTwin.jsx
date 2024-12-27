import { useEffect, useState } from "react";
import { Box, Divider, Typography } from "@mui/material";
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
import AppLoader from "../../components/AppLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";

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
          `/digital-twin/project`,
          {},
          authToken
        );
        if (response && response.data) {
          const transformedProperties = response.data
            ?.filter(
              (item) => item.spaceData?.status && item?.spaceData?.spaceId
            )
            .map((item) => ({
              _id: item?._id,
              name: item?.name,
              spaceData: item?.spaceData,
              hasActiveHotDesk: item?.hasActiveHotDesk,
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
        toast.error("Failed to fetch properties. Please try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          style: {
            background: "#1c1c1c",
            color: "white",
          },
        });
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
      toast.error("Failed to fetch poc. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        style: {
          background: "#1c1c1c",
          color: "white",
        },
      });
    }
  };

  const fetchUnits = async () => {
    try {
      const queryParams = {
        project: selectedProjects._id,
        sort: "-createdAt",
        status: "available",
      };

      const response = await get("digital-twin/listing", queryParams, authToken);

      if (response && response.data) {
        const transformedProperties = response.data
          .filter((item) => item?.smplrSpaceData?.objectId)
          .map((item) => ({
            _id: item?._id,
            name: item?.unitAddress || "Unnamed Unit",
            smplrSpaceData: item?.smplrSpaceData,
            status: item?.occupancyStatus,
            occupancyStatus: item?.occupancyStatus,
            buildUpArea: item?.buildUpArea || 0,
            numberOfSeats: item?.numberOfSeats || 0,
            project: item?.project || "Unknown Project",
            isFromHomes: item?.isFromHomes || false,
          }));

        handleUnits(transformedProperties);
      } else {
        console.error("No properties found in the response");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to fetch listings. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        style: {
          background: "#1c1c1c",
          color: "white",
        },
      });
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
      toast.error("Failed to fetch faciclities. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        style: {
          background: "#1c1c1c",
          color: "white",
        },
      });
    }
  };

  const fetchUnitOccupancy = async () => {
    setLoadUnitOccupancy(true);
    try {
      const queryParams = {
        project: selectedProjects._id,
        floorIndex: selectedFloor !== null ? selectedFloor : null,
      };

      const response = await get(
        "/digital-twin/overview/occupancy-status",
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
      toast.error("Failed to fetch listings occupancy. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        style: {
          background: "#1c1c1c",
          color: "white",
        },
      });
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
        floorIndex: selectedFloor !== null ? selectedFloor : null,
        listingId: selectedUnits?._id || null,
      };

      const response = await get(
        "/digital-twin/overview/transaction",
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
      toast.error("Failed to fetch total receivables. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        style: {
          background: "#1c1c1c",
          color: "white",
        },
      });
    } finally {
      setLoadTransaction(false);
    }
  };

  const fetchTotalFacility = async () => {
    setLoadTotalFacility(true);
    try {
      const queryParams = {
        projects: selectedProjects._id,
        floorIndex: selectedFloor !== null ? selectedFloor : null,
      };
      const response = await get(
        "/digital-twin/overview/facility",
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
      toast.error("Failed to fetch facility count. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        style: {
          background: "#1c1c1c",
          color: "white",
        },
      });
    } finally {
      setLoadTotalFacility(false);
    }
  };

  const fetchTicketsStatus = async () => {
    setLoadTicketsStatus(true);
    try {
      const queryParams = {
        projects: selectedProjects._id,
        floorIndex: selectedFloor !== null ? selectedFloor : null,
        id: selectedFacilities?._id || selectedUnits?._id || null,
      };
      const response = await get(
        "/digital-twin/overview/tickets",
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
      toast.error("Failed to fetch tickets. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        style: {
          background: "#1c1c1c",
          color: "white",
        },
      });
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
        floorIndex: selectedFloor !== null ? selectedFloor : null,
        listingId: selectedUnits?._id || null,
      };

      const response = await get(
        "/digital-twin/overview/transaction",
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
      toast.error("Failed to fetch total payables. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        style: {
          background: "#1c1c1c",
          color: "white",
        },
      });
    } finally {
      setLoadTransaction(false);
    }
  };

  const fetchTicketsForSpace = async () => {
    setIsLoading(true);
    try {
      const queryParams = {
        status: ["open", "re-open", "on-hold", "in-progress"],
        floorIndex: selectedFloor !== null ? selectedFloor : null,
        facilityId: selectedFacilities?._id || "",
        listingId: selectedUnits?._id || "",
        projectId: selectedProjects._id,
      };
      const response = await get(
        `/digital-twin/smplr-space/mapped-tickets`,
        queryParams,
        authToken
      );
      const allTickets = response?.data?.flatMap((item) => item.tickets);
      handleTickets(allTickets);
      handleTicketsOnSpace(response?.data);
    } catch (error) {
      console.log("fetching tickets for space error", error);
      toast.error("Failed to fetch tickets. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        style: {
          background: "#1c1c1c",
          color: "white",
        },
      });
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
        status: ["pending", "approved"],
        // Remove endDate
        startDate: moment().startOf("day").format("YYYY-MM-DD"),
        showActiveBookingsOnly: true,
      };

      const response = await get(
        `/facility/${selectedFacilities?._id}/booking-history`,
        queryParams,
        authToken
      );

      if (response && response.data) {
        // Filtering bookings for only today and future bookings
        const currentAndFutureBookings = response.data.rows.filter((booking) =>
          moment(booking.endDate).isSameOrAfter(moment().startOf("day"), "day")
        );

        const userDetailsPromises = currentAndFutureBookings.map((data) =>
          fetchFacilityUserDetails(
            data?.user,
            data?.rate,
            data?.facility?.bookingInfo,
            data?.startDate,
            data?.endDate,
            data?.status,
            data?.totalAmount
          )
        );

        const allUserDetails = await Promise.all(userDetailsPromises);
        handleFacilityUserDetails(allUserDetails);
      } else {
        console.error("No properties found in the response");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        "Failed to fetch facility booking history. Please try again.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          style: {
            background: "#1c1c1c",
            color: "white",
          },
        }
      );
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
    status,
    totalAmount
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
          totalAmount: totalAmount,
        };

        return userDetail;
      } else {
        console.error("No properties found in the response");
        return null;
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch users. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        style: {
          background: "#1c1c1c",
          color: "white",
        },
      });
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
      toast.error("Failed to fetch facility details. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        style: {
          background: "#1c1c1c",
          color: "white",
        },
      });
    }
  };

  const fetchHomeDetails = async () => {
    setLoadUnit(true);
    try {
      const params = {
        limit: 9007199254740991,
        listings: selectedUnits?._id,
        page: 1,
        projects: selectedProjects?._id,
        status: ["active", "moving-out", "upcoming"],
      };
      const url = `/home/indexV2`;
      const response = await get(url, params, authToken);

      // Fetch tax
      const responseDataForTax = await get(
        `/tax?limit=9007199254740991&page=1`,
        {projects: selectedProjects?._id},
        authToken
      );

      // Fetch categories related to the project
      const projectId = selectedProjects?._id;
      const categoryParams = `?belongsTo=Project&categoryType=roomCategory&limit=9007199254740991&page=1&project=${projectId}&status=active`;
      const categoryResponse = await get(
        `/category${categoryParams}`,
        {},
        authToken
      );

      const {
        data: { rows: categories = [] },
      } = categoryResponse;

      const {
        data: { rows = [] },
      } = response;

      // const filteredRows =
      //   rows.filter((row) => row.occupancyStatus !== "draft") || [];

      const filteredRows = rows.filter((row) =>
        row.occupancyStatus !== "draft" &&
        !(
          (row.occupancyStatus === "move_in_pending" ||
            row.occupancyStatus === "under_notice" ||
            row.occupancyStatus === "moved_out" ||
            row.occupancyStatus === "vacant" ||
            row.occupancyStatus === "occupied_by_tenant" ||
            row.occupancyStatus === "occupied_by_owner" ||
            row.occupancyStatus === "shifting") &&
          row.contractEndDate &&
          new Date(row.contractEndDate) < new Date()
        )
      ) || [];


      if (filteredRows.length > 0) {
        const homeDetail = filteredRows[0];
        handleHomeTenants(homeDetail.billTo);
        handlePocDetails(homeDetail.pointOfContacts);

        // Function to find numberOfUnits from plans or categories
        const findNumberOfUnits = (itemId) => {
          // First check in plans if they exist
          if (homeDetail.plans?.length > 0) {
            const planMatch = homeDetail.plans.find(
              (plan) => plan._id === itemId || plan.category === itemId
            );
            if (planMatch?.numberOfUnits) return planMatch.numberOfUnits;
          }

          // Then check in categories
          if (homeDetail.categories?.length > 0) {
            const categoryMatch = homeDetail.categories.find(
              (category) =>
                category._id === itemId || category.categoryId === itemId
            );
            if (categoryMatch?.numberOfUnits)
              return categoryMatch.numberOfUnits;
          }

          return 1; // Default to 1 if no match found
        };

        // Process deposits with numberOfUnits
        homeDetail.deposits = (homeDetail.deposits || []).map((deposit) => {
          let updatedDeposit = { ...deposit };

          // Handle tax information
          if (deposit.applicableTax === null) {
            updatedDeposit.applicableTax = "Inclusive";
          } else {
            const taxData = responseDataForTax?.data?.rows.find(
              (tax) => tax?._id === deposit?.applicableTax
            );
            if (taxData) {
              updatedDeposit = {
                ...updatedDeposit,
                applicableTax: taxData?._id,
                taxRate: taxData?.taxRate,
                taxName: taxData?.name,
              };
            }
          }

          // Add numberOfUnits from plans or categories
          updatedDeposit?.numberOfUnits = findNumberOfUnits(
            deposit?.category || deposit?.plan
          );

          return updatedDeposit;
        });

        // Process rents with numberOfUnits
        homeDetail.rentDetails = (homeDetail.rentDetails || []).map((rent) => {
          return {
            ...rent,
            numberOfUnits: findNumberOfUnits(
              rent.categoryId || rent.productAndService
            ),
          };
        });

        // Process plans if they exist
        if (homeDetail.plans?.length > 0) {
          homeDetail.plans = homeDetail.plans.map((planItem) => {
            const categoryMatch = categories.find(
              (category) => category._id === planItem.category
            );
            return {
              ...planItem,
              categoryName: categoryMatch ? categoryMatch.name : null,
              categoryStatus: categoryMatch ? categoryMatch.status : null,
            };
          });
        } else {
          homeDetail.plans = [];
        }

        // Process categories if they exist
        if (homeDetail.categories?.length > 0) {
          homeDetail.categories = homeDetail.categories.map((categoryItem) => {
            const categoryMatch = categories.find(
              (category) => category._id === categoryItem.categoryId
            );

            const matchedDeposit = homeDetail.deposits.find(
              (deposit) => deposit.category === categoryItem.categoryId
            );

            return {
              ...categoryItem,
              categoryName: categoryMatch ? categoryMatch.name : null,
              categoryStatus: categoryMatch ? categoryMatch.status : null,
              amount: matchedDeposit?.amount || null,
              applicableTax: matchedDeposit?.applicableTax || null,
            };
          });
        } else {
          homeDetail.categories = [];
        }

        handleHomeDetails(homeDetail);
      } else {
        handleHomeDetails([]);
        handleHomeTenants([]);
        handlePocDetails([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch homes details. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        style: {
          background: "#1c1c1c",
          color: "white",
        },
      });
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
      fetchTotalPayables();
      fetchTotalReceivables();
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "16px 16px 8px",
                }}
              >
                {(selectedFacilities?._id || (selectedFloor !== null && selectedFloor !== undefined)) && (
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

                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h4"
                    component="h4"
                    sx={{
                      color: "#0F0F0F",
                      fontSize: "16px",
                      fontWeight: "400",
                    }}
                  >
                    {selectedFacilities
                      ? `Facilities - ${selectedProjects?.name}`
                      : selectedFloor !== null && selectedFloor !== undefined
                        ? `Floor ${selectedFloor + 1} - ${selectedProjects?.name}`
                        : selectedProjects?.name}
                  </Typography>

                  {selectedProjects?.hasActiveHotDesk && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#4caf50",
                        fontSize: "12px",
                        fontWeight: "normal",
                        marginTop: "4px",
                        border: "1px solid #4caf50", 
                        borderRadius: "4px",
                        padding: "4px 8px",
                        display: "inline-block", 
                      }}
                    >
                      Stats for the Hot Desks are not shown on the Digital Twin
                    </Typography>
                  )}
                </Box>
              </Box>
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
                      if (selectedFacilities?._id) {
                        const parentUrl = `${baseUrl}/godview/#/facility-booking/view/${selectedFacilities?._id}`;
                        window.open(parentUrl, "_blank");
                      }
                    }}
                    isFacility
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
                      <AppLoader thickness={5} size={30} color="#FFFFFF" />
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
                      selectedFloor={selectedFloor}
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
                      isFacility
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
                      unitsDetails={selectedUnits}
                      onClickHandler={() => {
                        if (selectedUnits?._id) {
                          const parentUrl = `${baseUrl}/godview/#/listing/view/${selectedUnits._id}`;
                          window.open(parentUrl, "_blank");
                        }
                      }}
                    />
                    <ShowUnitAndFacility
                      name={"Contract Details"}
                      onClickHandler={() => {
                        if (homeDetails?._id) {
                          const parentUrl = `${baseUrl}/godview/#/contracts/view/commercial/${homeDetails._id}`;
                          window.open(parentUrl, "_blank");
                        }
                      }}
                      isCommercial
                      isDisabled={!homeDetails?._id}
                    />

                    <UnitData
                      homeDetails={homeDetails}
                      pocDetails={pocDetails}
                      homeTenants={homeTenants}
                      isLoading={loadUnit}
                      organizationCurrency={organizationCurrency}
                      organizationTimeZone={organizationTimeZone}
                      selectedUnits={selectedUnits}
                      loadTransaction={loadTransaction}
                      totalReceivables={totalReceivables}
                      totalPayables={totalPayables}
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
                    selectedFloor={selectedFloor}
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
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
              <AppLoader thickness={5} size={40} color="#FFFFFF" />
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
              <Box
                sx={{
                  height: "77vh",
                  overflowY: "auto",
                  '&::-webkit-scrollbar': {
                    display: 'none'
                  },
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none',
                }}
              >
                {renderSpaceDetails()}
              </Box>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default DigitalTwin;
