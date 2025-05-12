import React, { createContext, useContext, useReducer } from "react";

// ================================= state ================================
const initialState = {
  enterSpaceId: "",
  authToken: "",
  lang: "",
  projectId: "",
  projectName: "",
  spaceId: "",
  invalidSpace: false,
  validSpace: false,
  floorWisePolygons: [],
  // floors: new Set(),
  floors: [],
  viewerReady: false,
  propertyName: "",
  open: false,
  mappedPolygons: [],
  selectedFloor: null,
  selectedFloorName: "",
  selectedFloorData: [],
  allUnitsAndFacilities: {},
  selectedItems: {},
  data: [],
  updatedSelectedItems: {},
  allProjects: [],
  loadMappedData: false,
  selectedObjectId: "",
  editingRowObjectId: null,
};

// ================================= actions ================================
const SET_ENTER_SPACE_ID = "SET_ENTER_SPACE_ID";
const SET_AUTH_TOKEN = "SET_AUTH_TOKEN";
const SET_LANG = "SET_LANG";
const SET_PROJECT_ID = "SET_PROJECT_ID";
const SET_PROJECT_NAME = "SET_PROJECT_NAME";
const SET_SPACE_ID = "SET_SPACE_ID";
const SET_VALID_SPACE = "SET_VALID_SPACE";
const SET_INVALID_SPACE = "SET_INVALID_SPACE";
const SET_FLOOR_WISE_POLYGONS = "SET_FLOOR_WISE_POLYGONS";
const SET_FLOORS = "SET_FLOORS";
const SET_VIEWER_READY = "SET_VIEWER_READY";
const SET_PROPERTY_NAME = "SET_PROPERTY_NAME";
const SET_OPEN = "SET_OPEN";
const SET_CLOSE = "SET_CLOSE";
const SET_MAPPED_POLYGONS = "SET_MAPPED_POLYGONS";
const SET_SELECTED_FLOOR_DATA = "SET_SELECTED_FLOOR_DATA";
const SET_ALL_UNITS_AND_FACILITIES = "SET_ALL_UNITS_AND_FACILITIES";
const SET_SELECTED_ITEM = "SET_SELECTED_ITEM";
const SET_SELECTED_ROOM_ON_SPACE = "SET_SELECTED_ROOM_ON_SPACE";
const SET_DATA = "SET_DATA";
const SET_UPDATED_SELECTED_ITEMS = "SET_UPDATED_SELECTED_ITEMS";
const SET_ALL_PROJECTS = "SET_ALL_PROJECTS";
const SET_LOAD_MAPPED_DATA = "SET_LOAD_MAPPED_DATA";
const SET_SELECTED_OBJECT_ID = "SET_SELECTED_OBJECT_ID";
const SET_SELECTED_FLOOR = "SET_SELECTED_FLOOR";

// ================================= reducer ================================
const spaceReducer = (state, action) => {
  switch (action.type) {
    case SET_ENTER_SPACE_ID:
      return { ...state, enterSpaceId: action.payload };
    case SET_AUTH_TOKEN:
      return { ...state, authToken: action.payload };
    case SET_LANG:
      return { ...state, lang: action.payload };
    case SET_PROJECT_ID:
      return { ...state, projectId: action.payload };
    case SET_PROJECT_NAME:
      return { ...state, projectName: action.payload };
    case SET_SPACE_ID:
      return { ...state, spaceId: action.payload };
    case SET_INVALID_SPACE:
      return { ...state, invalidSpace: action.payload };
    case SET_VALID_SPACE:
      return { ...state, validSpace: action.payload };
    case SET_FLOOR_WISE_POLYGONS:
      return { ...state, floorWisePolygons: action.payload };
    // case SET_FLOORS:
    //   return {
    //     ...state,
    //     floors: new Set([...state.floors, ...action.payload]),
    //   };
    case SET_FLOORS:
      return {
        ...state,
        floors: action.payload.map((item,index) => ({
          name: item.name,
          value: index
        })),
      };
    case SET_VIEWER_READY:
      return { ...state, viewerReady: action.payload };

    case SET_PROPERTY_NAME:
      return { ...state, propertyName: action.payload };
    case SET_OPEN:
      return { ...state, open: action.payload };
    case SET_CLOSE:
      return { ...state, open: action.payload };
    case SET_MAPPED_POLYGONS:
      return { ...state, mappedPolygons: action.payload };
    case SET_SELECTED_FLOOR_DATA:
      return {
        ...state,
        selectedFloorData: action.payload.floorData,
        selectedFloor: action.payload.floor,
        selectedFloorName: action.payload.name,
      };
    case SET_ALL_UNITS_AND_FACILITIES:
      return { ...state, allUnitsAndFacilities: action.payload };
    case SET_SELECTED_ITEM:
      return { ...state, selectedItems: action.payload };
    case SET_DATA:
      return { ...state, data: action.payload };
    case SET_UPDATED_SELECTED_ITEMS:
      return { ...state, updatedSelectedItems: action.payload };
    case SET_ALL_PROJECTS:
      return { ...state, allProjects: action.payload };
    case SET_LOAD_MAPPED_DATA:
      return { ...state, loadMappedData: action.payload };
    case SET_SELECTED_OBJECT_ID:
      return { ...state, selectedObjectId: action.payload };
    case SET_SELECTED_FLOOR:
      return { ...state, selectedFloor: action.payload };
    default:
      return state;
  }
};

//================================= context ================================
export const SpaceContext = createContext();

export const SpaceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(spaceReducer, initialState); // Use useReducer here

  const handleEnterSpaceId = (enterSpaceId) =>
    dispatch({ type: SET_ENTER_SPACE_ID, payload: enterSpaceId });

  const handleAuthToken = (authToken) => {
    dispatch({ type: SET_AUTH_TOKEN, payload: authToken });
  };

  const handleLang = (lang) => {
    dispatch({ type: SET_LANG, payload: lang });
  };

  const handleProject = (projectId) => {
    dispatch({ type: SET_PROJECT_ID, payload: projectId });
  };

  const handleProjectName = (projectName) => {
    dispatch({ type: SET_PROJECT_NAME, payload: projectName });
  };

  const handleInvalidSpace = (invalidSpace) =>
    dispatch({ type: SET_INVALID_SPACE, payload: invalidSpace });
  const handleValidSpace = (validSpace) =>
    dispatch({ type: SET_VALID_SPACE, payload: validSpace });

  const handleFloorWisePolygons = (floorWisePolygons) => {
    dispatch({ type: SET_FLOOR_WISE_POLYGONS, payload: floorWisePolygons });
  };

  const handleFloors = (floors) => {
    dispatch({ type: SET_FLOORS, payload: floors });
  };

  const handleViewerReady = (viewerReady) => {
    dispatch({ type: SET_VIEWER_READY, payload: viewerReady });
  };

  const handlePropertyName = (propertyName) => {
    dispatch({ type: SET_PROPERTY_NAME, payload: propertyName });
  };

  const handleOpen = (open) => dispatch({ type: SET_OPEN, payload: open });
  const handleClose = (open) => dispatch({ type: SET_CLOSE, payload: open });

  const handleMappedPolygons = (polygons) =>
    dispatch({ type: SET_MAPPED_POLYGONS, payload: polygons });

  const handleSelectedFloorData = (data) => {
    dispatch({ type: SET_SELECTED_FLOOR_DATA, payload: data });
  };

  const handleAllUnitsAndFacilities = (allUnitsAndFacilities) => {
    dispatch({
      type: SET_ALL_UNITS_AND_FACILITIES,
      payload: allUnitsAndFacilities,
    });
  };

  const handleSelectedItems = (selectedItems) => {
    dispatch({
      type: SET_SELECTED_ITEM,
      payload: selectedItems,
    });
  };

  const handleUpdatedSelectedItems = (updatedSelectedItems) => {
    dispatch({
      type: SET_UPDATED_SELECTED_ITEMS,
      payload: updatedSelectedItems,
    });
  };

  const updateData = (data) => dispatch({ type: SET_DATA, payload: data });

  const handleAllProjects = (data) =>
    dispatch({ type: SET_ALL_PROJECTS, payload: data });

  const handleLoadMappedData = (data) =>
    dispatch({ type: SET_LOAD_MAPPED_DATA, payload: data });

  const handleSelectedObjectId = (data) =>
    dispatch({ type: SET_SELECTED_OBJECT_ID, payload: data });

  const handleSelectedFloor = (floor) => {
    dispatch({ type: SET_SELECTED_FLOOR, payload: floor });
  };

  const value = {
    state,
    handleEnterSpaceId,
    handleAuthToken,
    handleLang,
    handleProject,
    handleProjectName,
    handleValidSpace,
    handleInvalidSpace,
    handleFloorWisePolygons,
    handleFloors,
    handleViewerReady,
    handlePropertyName,
    handleOpen,
    handleClose,
    handleMappedPolygons,
    handleSelectedFloorData,
    handleAllUnitsAndFacilities,
    handleSelectedItems,
    updateData,
    handleUpdatedSelectedItems,
    handleAllProjects,
    handleLoadMappedData,
    handleSelectedObjectId,
    handleSelectedFloor,
  };

  return (
    <SpaceContext.Provider value={value}>{children}</SpaceContext.Provider>
  );
};

//================================== hooks ================================
export const useSpace = () => {
  const context = useContext(SpaceContext);
  if (context === undefined) {
    throw new Error("useSpace must be used within a SpaceProvider");
  }
  return context;
};
