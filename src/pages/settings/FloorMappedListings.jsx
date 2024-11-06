import React, { useState, useEffect, useRef, useCallback } from "react";
import Grid from "@mui/material/Grid2";
import { Box, Divider, Typography } from "@mui/material";
import Toolbar from "../../components/AppToolbar";
import { useSpace } from "../../store";
import { loadSmplrJs } from "@smplrspace/smplr-loader";
import { config } from "../../utils";
import AppInputField from "../../components/AppInputField";
import AppButton from "../../components/AppButton";
import CustomTable from "../../components/AppTable";
import AppModal from "../../components/AppModal";
import { patch } from "../../service";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const tooltipContainerStyle = {
  fontSize: "10px",
  lineHeight: "1",
  padding: "2px",
  maxWidth: "100px",
  backgroundColor: "rgba(255, 255, 255, 0)",
  borderRadius: "50%",
  boxShadow: "none",
};

const getTooltipHtml = () => `
  <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      padding: 0;
      margin: 0;
      border-radius: 50%;
      overflow: hidden;
  ">
      <img
          src="https://uploads-ssl.webflow.com/5eca8aa0518a6eb17eda7575/65a572aed02ee07c9a7dde5e_Pin1.png"
          alt="Icon"
          style="width: 100%; height: 100%;"
      />
  </div>
  `;

const FloorMappedListings = () => {
  const {
    state,
    handleViewerReady,
    handleClose,
    handleOpen,
    handleSelectedItems,
    handleSelectedObjectId,
  } = useSpace();
  const {
    selectedFloor,
    viewerReady,
    enterSpaceId,
    selectedFloorData,
    projectName,
    mappedPolygons,
    selectedItems,
    projectId,
    authToken,
    updatedSelectedItems,
    loadMappedData,
    selectedObjectId,
  } = state;

  const spaceRef = useRef(null);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);

  const [spaceData, setSpaceData] = useState([]);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [onSaveModal, setOnSaveModal] = useState(false);
  const [onBackModal, setOnBackModal] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [filteredData, setFilteredData] = useState({});

  const initializeSpaceViewer = useCallback(async () => {
    try {
      const smplr = await loadSmplrJs("esm");
      spaceRef.current = new smplr.Space({
        spaceId: enterSpaceId,
        clientToken: config.clientToken,
        containerId: config.containerId,
        whiteLabel: config.whiteLabel,
      });
      fetchData(smplr);
    } catch (error) {
      console.error("Error loading SmplrSpace:", error);
    }
  }, [enterSpaceId]);

  const fetchData = useCallback(
    async (smplr) => {
      try {
        const smplrClient = new smplr.QueryClient({
          organizationId: config.organizationId,
          clientToken: config.clientToken,
        });

        const space = await smplrClient.getSpace(enterSpaceId);
        const furnitures = await smplrClient.getAllFurnitureInSpace(
          enterSpaceId
        );

        setSpaceData(smplrClient);

        if (!space || !space.assetmap) {
          throw new Error("Invalid space data received");
        }

        const polygons = space.assetmap.filter(
          (item) => item.type === "polygon"
        );

        if (polygons.length === 0) {
          throw new Error("No polygon data found");
        }

        const filteredFloorData = polygons[0].assets.filter(
          (item) => item.levelIndex === selectedFloor - 1
        );

        await startViewer();
        setData(filteredFloorData);
        setData2(furnitures);
      } catch (error) {
        console.error("Error in fetchData:", error);
      }
    },
    [selectedFloor, enterSpaceId]
  );

  const startViewer = async () => {
    await spaceRef.current.startViewer({
      preview: false,
      mode: "3d",
      onReady: async () => {
        handleViewerReady(true);
        spaceRef.current.showUpToLevel(selectedFloor - 1 || 0);
      },
      onVisibleLevelsChanged: () => {},
      disableCameraControls: false,
      disableCameraRotation: false,
      hideNavigationButtons: false,
      hideLevelPicker: true,
      backgroundColor: "#ffffff",
    });
  };

  const addDataLayer = useCallback(() => {
    if (!viewerReady) return;

    const lastSelectedId = Object.keys(selectedItems).pop();
    const activeObjectId = selectedObjectId || lastSelectedId;

    const updatedData = data.map((item) => ({
      ...item,
      mapped: selectedItems.hasOwnProperty(item.id),
      highlighted: item.id === activeObjectId,
    }));

    const updatedFurnitureData = data2.map((furniture) => ({
      id: furniture.id,
      furnitureId: furniture.id,
      catalogId: furniture.catalogId,
      name: furniture.name,
      levelIndex: furniture.levelIndex,
      position: furniture.position,
      rotation: furniture.rotation,
      dimensions: furniture.dimensions,
      configuration: furniture.configuration,
      mapped: selectedItems.hasOwnProperty(furniture.id),
      highlighted: furniture.id === activeObjectId,
    }));

    const filteredItems = Object.fromEntries(
      Object.entries(selectedItems).filter(
        ([_, value]) => !value.smplrSpaceData
      )
    );

    setFilteredData(filteredItems);

    const getTooltipContent = (d) => {
      if (!d.highlighted) return null;

      return `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          padding: 0;
          margin: 0;
          border-radius: 50%;
          overflow: hidden;
        ">
          <img
            src="https://uploads-ssl.webflow.com/5eca8aa0518a6eb17eda7575/65a572aed02ee07c9a7dde5e_Pin1.png"
            alt="Icon"
            style="width: 100%; height: 100%;"
          />
        </div>
      `;
    };

    if (data2?.length > 0) {
      spaceRef?.current.addFurnitureDataLayer({
        id: "furnitures",
        type: "furniture",
        data: updatedFurnitureData,
        color: (d) =>
          d.mapped ? "green" : d.highlighted ? "yellow" : "orange",
        // onClick: (d) => {
        //   console.log("Clicked on furniture:", d);
        // },
        tooltip: getTooltipContent,
        persistentTooltip: true,
        tooltipContainerStyle: tooltipContainerStyle,
      });
    }

    spaceRef.current.addDataLayer({
      id: "rooms",
      type: "polygon",
      data: updatedData,
      color: (d) => (d.mapped ? "green" : d.highlighted ? "yellow" : "#ae3ec9"),
      // alpha: data2.length > 0 ? 0.8 : 1,
      alpha: 1,
      height: 0.7,
      // onClick: (d) => {
      //   console.log("Clicked on room:", d);
      // },
      tooltip: getTooltipContent,
      persistentTooltip: true,
      tooltipContainerStyle: tooltipContainerStyle,
    });
  }, [data, data2, viewerReady, selectedObjectId, selectedItems]);

  useEffect(() => {
    const transformedData = data.reduce((acc, item) => {
      const objectId = item.smplrSpaceData.objectId;
      acc[objectId] = { ...item };
      return acc;
    }, {});

    handleSelectedItems(transformedData);

    initializeSpaceViewer();
  }, [initializeSpaceViewer]);

  useEffect(() => {
    if (data.length > 0 && viewerReady) {
      addDataLayer();
    }
  }, [data, viewerReady, selectedItems, addDataLayer]);

  const onClickMappedUnitHandler = async () => {
    setLoading(true);

    const payload = { smplrSpaceData: Object.values(filteredData) };
    try {
      const response = await patch(
        `/listing/addUnitsAndFacilities/${projectId}`,
        payload,
        authToken
      );
      if (response.status === 200) {
        // handleClose(false);
        setOnSaveModal(false);
        handleSelectedObjectId("");
        navigate("/floor-listings");
      } else {
        console.log("Failed to add space ID");
      }
    } catch (error) {
      console.log("Error ", error);
    } finally {
      setLoading(false);
    }
  };

  const renderInfoItem = (label, value) => (
    <Grid item>
      <Typography
        variant="body2"
        component="span"
        sx={{ fontSize: "12px", color: "#848484" }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        component="span"
        sx={{
          fontSize: "14px",
          color: "rgba(0, 0, 0, .87);",
          whiteSpace: "nowrap",
        }}
      >
        <br />
        {value}
      </Typography>
    </Grid>
  );

  const renderSearchAndInfo = () => {
    const isProjectNameTooLong = projectName.length > 30;

    return (
      <Box sx={{ mt: 2, px: 2 }}>
        <Grid container spacing={4} alignItems="flex-start">
          <Grid item size={isProjectNameTooLong ? 12 : 5}>
            <AppInputField
              labelText="Search"
              showSearchIcon={true}
              fullWidth
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              labelFont="14px"
              width={isProjectNameTooLong ? "600px" : "300px"}
            />
          </Grid>
          <Grid item size={isProjectNameTooLong ? 12 : 7}>
            <Grid container spacing={4}>
              <Grid item size={isProjectNameTooLong ? 7 : 4}>
                {renderInfoItem("Property", projectName)}
              </Grid>
              <Grid item size={isProjectNameTooLong ? 1 : 4}>
                {renderInfoItem("Floor", selectedFloor)}
              </Grid>
              <Grid item size={4}>
                {renderInfoItem(
                  "Total Mapped",
                  `${mappedPolygons.length} / ${selectedFloorData?.length}`
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderSpaceViewer = () => (
    <Box
      id="space"
      className="smplr-wrapper"
      sx={{
        height: "76vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        position: "relative",
      }}
    >
      <Box
        id={config.containerId}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    </Box>
  );

  const onClickBackHandler = () => {
    if (Object.keys(filteredData).length === 0) {
      window.history.back();
    } else {
      setOnBackModal(true);
    }
  };

  const onClickDiscardButton = () => {
    setOnBackModal(false);
    window.history.back();
    handleSelectedObjectId("");
  };

  const filterData = useCallback(
    (dataToFilter) => {
      if (!searchText) return dataToFilter;
      return dataToFilter.filter(
        (item) =>
          item.objectName
            .toLowerCase()
            .includes(searchText.toLowerCase().trim()) ||
          item.objectId.toLowerCase().includes(searchText.toLowerCase().trim())
      );
    },
    [searchText]
  );

  const filteredSelectedFloorData = filterData(selectedFloorData);

  return (
    <>
      <Toolbar labelText="Map Units" onClickBackHandler={onClickBackHandler} />
      <Box sx={{ flexGrow: 1, background: "#ffffff" }}>
        <Grid container>
          <Grid item size={7} spacing={1}>
            {loadMappedData ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100px",
                }}
              >
                <CircularProgress thickness={5} size={30} color="#000000" />
              </Box>
            ) : (
              <>
                {renderSearchAndInfo()}
                <CustomTable tableData={filteredSelectedFloorData} />
                <Divider sx={{ mt: 1 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    py: 1,
                    px: 2,
                  }}
                >
                  <AppButton
                    labelText="Save"
                    variant="contained"
                    color="primary"
                    disabled={Object.keys(filteredData).length === 0}
                    onClick={() => {
                      // handleOpen(true)
                      setOnSaveModal(true);
                    }}
                  />
                </Box>
              </>
            )}
          </Grid>
          <Grid item size={5}>
            {renderSpaceViewer()}
          </Grid>
        </Grid>
        <AppModal
          open={onBackModal}
          headerText={"Warning"}
          descriptionText={
            <>
              <Typography sx={{ color: "#1B1A1A", fontSize: "16px" }}>
                You have unsaved changes on this page .
              </Typography>
              <Typography sx={{ color: "#1B1A1A", fontSize: "16px" }}>
                Are you sure you want to exit ?
              </Typography>
            </>
          }
          primaryButtonText="Save"
          secondaryButtonText="Cancel"
          discardButtonText="Discard"
          onClickPrimaryButton={onClickMappedUnitHandler}
          onClickCancelHandler={() => {
            setOnBackModal(false);
          }}
          onClickDiscardButton={onClickDiscardButton}
          isLoading={loading}
        />
        <AppModal
          open={onSaveModal}
          headerText="Confirmation"
          descriptionText={
            <>
              <Typography sx={{ color: "#646464", fontSize: "15px" }}>
                Total Mapped Units{" "}
              </Typography>
              <Typography
                component="span"
                sx={{ color: "#1B1A1A", fontSize: "16px" }}
              >
                {Object.keys(selectedItems).length || 0}/
                {selectedFloorData.length}
              </Typography>
              <br />
              <Box sx={{ height: "16px" }} />
              <Typography sx={{ color: "#1B1A1A", fontSize: "16px" }}>
                Are you sure you want to save?
              </Typography>
            </>
          }
          primaryButtonText="Yes"
          secondaryButtonText="Cancel"
          onClickPrimaryButton={onClickMappedUnitHandler}
          isLoading={loading}
          onClickCancelHandler={() => {
            // handleClose(false)
            setOnSaveModal(false);
          }}
        />
      </Box>
    </>
  );
};

export default FloorMappedListings;
