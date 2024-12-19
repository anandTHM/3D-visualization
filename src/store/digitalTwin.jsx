import React, { createContext, useContext, useReducer } from "react";

// ================================= state ================================
const initialState = {
  projects: [],
  units: [],
  facilities: [],
  selectedProjects: null,
  selectedUnits: null,
  selectedFacilities: null,
  unitOccupancy: {},
  totalReceivables: "",
  totalPayables: "",
  totalFacility: {},
  ticketsStatus: {},
  tickets: [],
  onClickFacility: null,
  facilityBooking: [],
  facilityDetails: {},
  facilityUserDetails: [],
  organizationTimeZone: "",
  organizationCurrency: "",
  onClickStatus: "All",
  clickedTable: "",
  homeDetails: [],
  pocDetails: [],
  homeTenants: [],
  selectedTab: "Overview",
  ticketsOnSpace: [],
  ticketStatusFilter: "",
  clientToken: "pub_838e6b526dc14f81b3ded7bf5a9f42ce",
  organizationId: "7d271fde-b941-4495-9578-2ed7a539b03e",
};

// ================================= actions ================================
const SET_PROJECTS = "SET_PROJECTS";
const SET_UNITS = "SET_UNITS";
const SET_FACILITIES = "SET_FACILITIES";
const SET_SELECTED_PROJECTS = "SET_SELECTED_PROJECTS";
const SET_SELECTED_UNITS = "SET_SELECTED_UNITS";
const SET_SELECTED_FACILITIES = "SET_SELECTED_FACILITIES";
const SET_UNIT_OCCUPANCY = "SET_UNIT_OCCUPANCY";
const SET_RECEIVABLES = "SET_RECEIVABLES";
const SET_PAYABLES = "SET_PAYABLES";
const SET_TOTAL_FACILITY = "SET_TOTAL_FACILITY";
const SET_TICKETS_STATUS = "SET_TICKETS_STATUS";
const SET_TICKETS = "SET_TICKETS";
const SET_ON_CLICK_FACILITY = "SET_ON_CLICK_FACILITY";
const SET_FACILITY_BOOKING = "SET_FACILITY_BOOKING";
const SET_FACILITY_DETAILS = "SET_FACILITY_DETAILS";
const SET_FACILITY_USER_DETAILS = "SET_FACILITY_USER_DETAILS";
const SET_ORGANIZATION_TIMEZONE = "SET_ORGANIZATION_TIMEZONE";
const SET_ORGANIZATION_CURRENCY = "SET_ORGANIZATION_CURRENCY";
const SET_ON_CLICK_STATUS = "SET_ON_CLICK_STATUS";
const SET_CLICKED_TABLE = "SET_CLICKED_TABLE";
const SET_HOME_DETAILS = "SET_HOME_DETAILS";
const SET_POC_DETAILS = "SET_POC_DETAILS";
const SET_HOME_TENANTS = "SET_HOME_TENANTS";
const SET_SELECTED_TAB = "SET_SELECTED_TAB";
const SET_TICKETS_ON_SPACE = "SET_TICKETS_ON_SPACE";
const SET_TICKET_STATUS_FILTER = "SET_TICKET_STATUS_FILTER";
const SET_CLIENT_TOKEN = "SET_CLIENT_TOKEN";
const SET_ORGANIZATION_ID = "SET_ORGANIZATION_ID";

// ================================= reducer ================================
const digitalTwinReducer = (state, action) => {
  switch (action.type) {
    case SET_PROJECTS:
      return {
        ...state,
        projects: action.payload,
      };
    case SET_UNITS:
      return {
        ...state,
        units: action.payload,
      };
    case SET_FACILITIES:
      return {
        ...state,
        facilities: action.payload,
      };
    case SET_SELECTED_PROJECTS:
      return {
        ...state,
        selectedProjects: action.payload,
      };
    case SET_SELECTED_UNITS:
      return {
        ...state,
        selectedUnits: action.payload,
      };
    case SET_SELECTED_FACILITIES:
      return {
        ...state,
        selectedFacilities: action.payload,
      };

    case SET_UNIT_OCCUPANCY:
      return {
        ...state,
        unitOccupancy: action.payload,
      };
    case SET_RECEIVABLES:
      return {
        ...state,
        totalReceivables: action.payload,
      };
    case SET_PAYABLES:
      return {
        ...state,
        totalPayables: action.payload,
      };
    case SET_TOTAL_FACILITY:
      return {
        ...state,
        totalFacility: action.payload,
      };
    case SET_TICKETS_STATUS:
      return {
        ...state,
        ticketsStatus: action.payload,
      };
    case SET_TICKETS:
      return {
        ...state,
        tickets: action.payload,
      };
    case SET_ON_CLICK_FACILITY:
      return {
        ...state,
        onClickFacility: action.payload,
      };
    case SET_FACILITY_BOOKING:
      return {
        ...state,
        facilityBooking: action.payload,
      };
    case SET_FACILITY_DETAILS:
      return {
        ...state,
        facilityDetails: action.payload,
      };

    case SET_FACILITY_USER_DETAILS:
      return {
        ...state,
        facilityUserDetails: action.payload,
      };

    case SET_ORGANIZATION_TIMEZONE:
      return {
        ...state,
        organizationTimeZone: action.payload,
      };
    case SET_ORGANIZATION_CURRENCY:
      return {
        ...state,
        organizationCurrency: action.payload,
      };
    case SET_ON_CLICK_STATUS:
      return {
        ...state,
        onClickStatus: action.payload,
      };
    case SET_CLICKED_TABLE:
      return {
        ...state,
        clickedTable: action.payload,
      };
    case SET_HOME_DETAILS:
      return {
        ...state,
        homeDetails: action.payload,
      };
    case SET_POC_DETAILS:
      return {
        ...state,
        pocDetails: action.payload,
      };
    case SET_HOME_TENANTS:
      return {
        ...state,
        homeTenants: action.payload,
      };

    case SET_SELECTED_TAB:
      return {
        ...state,
        selectedTab: action.payload,
      };

    case SET_TICKETS_ON_SPACE:
      return {
        ...state,
        ticketsOnSpace: action.payload,
      };

    case SET_TICKET_STATUS_FILTER:
      return {
        ...state,
        ticketStatusFilter: action.payload,
      };
    case SET_ORGANIZATION_ID:
      return {
        ...state,
        organizationId: action.payload
      }

    case SET_CLIENT_TOKEN:
      return {
        ...state,
        clientToken: action.payload
      }

    default:
      return state;
  }
};

// ================================= context ================================
export const DigitalTwinContext = createContext();

// ================================= provider ================================
export const DigitalTwinProvider = ({ children }) => {
  const [state, dispatch] = useReducer(digitalTwinReducer, initialState);

  const handleProjects = (projects) => {
    dispatch({ type: SET_PROJECTS, payload: projects });
  };

  const handleUnits = (units) => {
    dispatch({ type: SET_UNITS, payload: units });
  };

  const handleFacilities = (facilities) => {
    dispatch({ type: SET_FACILITIES, payload: facilities });
  };

  const handleSelectedProjects = (projects) => {
    dispatch({ type: SET_SELECTED_PROJECTS, payload: projects });
  };

  const handleSelectedUnits = (units) => {
    dispatch({ type: SET_SELECTED_UNITS, payload: units });
  };

  const handleSelectedFacilities = (facilities) => {
    dispatch({ type: SET_SELECTED_FACILITIES, payload: facilities });
  };

  const handleUnitOccupancy = (unitOccupancy) => {
    dispatch({ type: SET_UNIT_OCCUPANCY, payload: unitOccupancy });
  };

  const handleReceivables = (transaction) => {
    dispatch({ type: SET_RECEIVABLES, payload: transaction });
  };

  const handlePayables = (transaction) => {
    dispatch({ type: SET_PAYABLES, payload: transaction });
  };

  const handleTotalFacility = (totalFacility) => {
    dispatch({ type: SET_TOTAL_FACILITY, payload: totalFacility });
  };

  const handleTicketsStatus = (ticketsStatus) => {
    dispatch({ type: SET_TICKETS_STATUS, payload: ticketsStatus });
  };

  const handleTickets = (tickets) => {
    dispatch({ type: SET_TICKETS, payload: tickets });
  };

  const handleOnClickFacility = (facility) => {
    dispatch({ type: SET_ON_CLICK_FACILITY, payload: facility });
  };

  const handleFacilityBooking = (facility) => {
    dispatch({ type: SET_FACILITY_BOOKING, payload: facility });
  };

  const handleFacilityDetails = (facility) => {
    dispatch({ type: SET_FACILITY_DETAILS, payload: facility });
  };

  const handleFacilityUserDetails = (facility) => {
    dispatch({ type: SET_FACILITY_USER_DETAILS, payload: facility });
  };

  const handleOrganizationTimeZone = (timezone) => {
    dispatch({ type: SET_ORGANIZATION_TIMEZONE, payload: timezone });
  };

  const handleOrganizationCurrency = (currency) => {
    dispatch({ type: SET_ORGANIZATION_CURRENCY, payload: currency });
  };

  const handleOnClickStatus = (status) => {
    dispatch({ type: SET_ON_CLICK_STATUS, payload: status });
  };

  const handleClickedTable = (table) => {
    dispatch({ type: SET_CLICKED_TABLE, payload: table });
  };

  const handleHomeDetails = (homeDetails) => {
    dispatch({ type: SET_HOME_DETAILS, payload: homeDetails });
  };

  const handlePocDetails = (pocDetails) => {
    dispatch({ type: SET_POC_DETAILS, payload: pocDetails });
  };

  const handleHomeTenants = (homeTenants) => {
    dispatch({ type: SET_HOME_TENANTS, payload: homeTenants });
  };

  const handleSelectedTab = (tab) => {
    dispatch({ type: SET_SELECTED_TAB, payload: tab });
  };

  const handleTicketsOnSpace = (tickets) => {
    dispatch({ type: SET_TICKETS_ON_SPACE, payload: tickets });
  };

  const handleTicketStatusFilter = (status) => {
    dispatch({ type: SET_TICKET_STATUS_FILTER, payload: status });
  };

  const handleClientToken = (token) => {
    dispatch({ type: SET_CLIENT_TOKEN, payload: token })
  }

  const handleOrganizationId = (id) => {
    dispatch({ type: SET_ORGANIZATION_ID, payload: id })
  }

  const value = {
    state,
    handleProjects,
    handleUnits,
    handleFacilities,
    handleSelectedProjects,
    handleSelectedUnits,
    handleSelectedFacilities,
    handleUnitOccupancy,
    handleReceivables,
    handlePayables,
    handleTotalFacility,
    handleTicketsStatus,
    handleTickets,
    handleOnClickFacility,
    handleFacilityBooking,
    handleFacilityDetails,
    handleFacilityUserDetails,
    handleOrganizationTimeZone,
    handleOrganizationCurrency,
    handleOnClickStatus,
    handleClickedTable,
    handleHomeDetails,
    handlePocDetails,
    handleHomeTenants,
    handleSelectedTab,
    handleTicketsOnSpace,
    handleTicketStatusFilter,
    handleClientToken,
    handleOrganizationId
  };

  return (
    <DigitalTwinContext.Provider value={value}>
      {children}
    </DigitalTwinContext.Provider>
  );
};

// ================================= hooks ================================
export const useDigitalTwin = () => {
  const context = useContext(DigitalTwinContext);
  if (context === undefined) {
    throw new Error("useDigitalTwin must be used within a DigitalTwinProvider");
  }
  return context;
};
