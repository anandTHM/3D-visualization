import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box, Button, Typography } from "@mui/material";
import { loadSmplrJs } from "@smplrspace/smplr-loader";
import { config } from "../../utils";
import { useSpace } from "../../store";
import { useDigitalTwin } from "../../store/digitalTwin";
import {
  OccupancyStatuses,
  tooltipContainerStyle,
  darkenColor,
  generateSvgDataUri,
  ticketsStatus as ticketsStatusData,
} from "../../utils/helper";

import pinSvg from "../../assets/pin.svg";

const styles = {
  containerBox: {
    position: "absolute",
    top: 5,
    left: 10,
    right: 5,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  statusBox: {
    width: 16,
    height: 16,
    marginRight: 1,
  },
  flexRowCenter: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    cursor: "pointer",
  },
  btnStyle: {
    backgroundColor: "white",
    color: "black",
    borderRadius: "8px",
    fontWeight: "bold",
    padding: "8px 16px",
    margin: "4px",
    textTransform: "none",
    borderColor: "transparent",
    "&:hover": {
      borderColor: "transparent",
    },
    "&:hover": {
      backgroundColor: "#f0f0f0",
    },
  },
  disabledBtnStyle: {
    backgroundColor: "#e0e0e0",
    color: "#a0a0a0",
    cursor: "pointer",
    opacity: 0.7,
    "&:hover": {
      backgroundColor: "#e0e0e0",
    },
  },
};

const statusMapping = {
  occupied_by_tenant: "Occupied",
  occupied_by_owner: "Occupied",
  vacant: "Vacant",
  not_ready: "Not Ready",
  under_notice: "Under Notice",
  unknown: "Unknown",
};

export const getTooltipHtml = (d) => {
  const mappedStatus = statusMapping[d.status] || "Unknown";

  const textContent = d.facilityId
    ? d.facilityName
    : d.unitId
    ? `${d.unitName} - ${mappedStatus}`
    : "Not Associated with Units or Facilities";

  return `
    <div style="
      display: flex;
      align-items: center;
      justify-content: flex-start;
      min-width: 150px;
      max-width: 400px; 
      width: max-content;
      height: auto;
      background-color: #ffffff;
      color: #333333;
      padding: 10px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      font-size: 14px;
      transform: translate(30px, -30px);
      font-family: Arial, sans-serif;
    ">
      <img src=${pinSvg} 
           style="
             width: 30px;
             height: 30px;
             margin-right: 8px;
             flex-shrink: 0;
           " 
           alt="Icon" />
      <div style="
           overflow: hidden;
           text-overflow: ellipsis;
           white-space: nowrap;
           flex: 0 1 auto;
      ">
        ${textContent}
      </div>
    </div>
  `;
};

const Space = () => {
  const [viewerReady, setViewerReady] = useState(false);
  const spaceRef = useRef(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [data, setData] = useState([]);
  const [dataLayer, setDataLayer] = useState([]);
  const viewerReadyRef = useRef(false);

  const [furniture, setFurniture] = useState([]);

  const { state: SpaceState, handleFloors, handleSelectedFloor } = useSpace();

  const {
    state: DigitalTwinState,
    handleSelectedUnits,
    handleOnClickStatus,
    handleSelectedFacilities,
    handleTicketsOnSpace,
    handleTicketStatusFilter,
  } = useDigitalTwin();

  const { selectedFloor, floors } = SpaceState;
  const {
    selectedProjects,
    selectedUnits,
    selectedFacilities,
    units,
    facilities,
    onClickStatus,
    ticketsOnSpace,
    selectedTab,
    ticketStatusFilter,
    ticketsStatus,
    unitOccupancy,
  } = DigitalTwinState;

  const [isLoadingViewer, setIsLoadingViewer] = useState(false);
  const currentProjectIdRef = useRef(null);
  const loadingSpacePromiseRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const cleanup = async () => {
      // Cancel any pending space loading
      if (loadingSpacePromiseRef.current) {
        try {
          await loadingSpacePromiseRef.current;
        } catch (error) {
          console.log("Cancelled previous loading");
        }
        loadingSpacePromiseRef.current = null;
      }

      // Cleanup viewer and data layers
      if (spaceRef.current) {
        try {
          spaceRef.current.removeDataLayer("rooms");
        } catch (error) {
          console.error("Cleanup error:", error);
        }
        spaceRef.current = null;
      }

      setViewerReady(false);
      viewerReadyRef.current = false;
      setData([]);
      setFurniture([]);
      setIsLoadingViewer(false);
    };

    const initViewer = async () => {
      if (!selectedProjects || !document.getElementById("test")) {
        await cleanup();
        return;
      }

      // Cleanup previous instance before starting new one
      await cleanup();

      setIsLoadingViewer(true);
      currentProjectIdRef.current = selectedProjects?._id;

      try {
        const smplr = await loadSmplrJs("umd");

        // Check if project changed during smplr loading
        if (
          !isMounted ||
          currentProjectIdRef.current !== selectedProjects?._id
        ) {
          throw new Error("Project changed during initialization");
        }

        const spaceInstance = new smplr.Space({
          spaceId: selectedProjects?.spaceData?.spaceId,
          clientToken: config.clientToken,
          containerId: "test",
        });

        spaceRef.current = spaceInstance;

        // Create a new promise for space loading
        loadingSpacePromiseRef.current = fetchData(smplr, spaceInstance);
        await loadingSpacePromiseRef.current;
      } catch (error) {
        console.error("Initialization error:", error);
        await cleanup();
      } finally {
        loadingSpacePromiseRef.current = null;
        if (isMounted) {
          setIsLoadingViewer(false);
        }
      }
    };

    initViewer();

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [selectedProjects]);

  // Modified dataLayer effect with additional safety checks

  useEffect(() => {
    const addDataLayerWithCheck = async () => {
      if (
        !spaceRef.current ||
        currentProjectIdRef.current !== selectedProjects?._id
      ) {
        return;
      }

      try {
        await addDataLayer();
      } catch (error) {
        console.error("Error adding data layer:", error);
        // Optionally trigger cleanup if data layer addition fails
        if (currentProjectIdRef.current === selectedProjects?._id) {
          if (spaceRef.current) {
            spaceRef.current.removeDataLayer("rooms");
          }
        }
      }
    };

    if (viewerReady && data.length > 0) {
      addDataLayerWithCheck();
    }
  }, [viewerReady, data, selectedUnits, onClickStatus, selectedFacilities]);

  useEffect(() => {
    if (
      (selectedFloor === null || selectedFloor === undefined) &&
      selectedUnits === null &&
      selectedFacilities === null
    ) {
      spaceRef?.current?.centerCamera();
      handleSelectedUnits(null);
      handleSelectedFacilities(null);
      spaceRef?.current?.showUpToLevel(Array.from(floors).length);
    }
  }, [selectedFloor, selectedUnits, selectedFacilities]);

  useEffect(() => {
    if (!viewerReady) return;

    if (
      (selectedFloor !== null && selectedFloor !== undefined) ||
      selectedUnits ||
      selectedFacilities
    ) {
      const floorIndex =
        selectedFloor ??
        selectedUnits?.smplrSpaceData?.index ??
        selectedFacilities?.smplrSpaceData?.index;

      const levelToShow =
        floorIndex !== undefined ? floorIndex : Array.from(floors).length;
      spaceRef.current.showUpToLevel(levelToShow);
    }
  }, [viewerReady, selectedFloor, selectedUnits, selectedFacilities, floors]);

  const fetchData = useCallback(
    async (smplr, spaceInstance) => {
      const currentProjectId = selectedProjects?._id;
      let viewerStartPromise;

      try {
        // Create a promise that can be cancelled
        viewerStartPromise = new Promise((resolve, reject) => {
          spaceInstance.startViewer({
            preview: false,
            mode: "3d",
            loadingMessage: "Building your space...",
            onReady: () => {
              // Check if project is still the same
              if (currentProjectId === selectedProjects?._id) {
                setViewerReady(true);
                viewerReadyRef.current = true;
                resolve();
              } else {
                reject(new Error("Project changed during viewer loading"));
              }
            },
            onError: (error) => {
              console.error("Could not start viewer", error);
              reject(error);
            },
            hideLevelPicker: true,
          });
        });

        await viewerStartPromise;

        // Check if project changed during viewer initialization
        if (currentProjectId !== selectedProjects?._id) {
          throw new Error("Project changed after viewer initialization");
        }

        const smplrClient = new smplr.QueryClient({
          organizationId: config.organizationId,
          clientToken: config.clientToken,
        });

        // Use Promise.race to implement timeout
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Data fetching timeout")), 30000)
        );

        const dataFetchPromise = Promise.all([
          smplrClient.getAllFurnitureInSpace(
            selectedProjects?.spaceData?.spaceId
          ),
          smplrClient.getSpace(
            selectedProjects?.spaceData?.spaceId || config.spaceId
          ),
        ]);

        const [furnitures, space] = await Promise.race([
          dataFetchPromise,
          timeoutPromise,
        ]);

        // Final check if project is still the same
        if (currentProjectId !== selectedProjects?._id) {
          throw new Error("Project changed during data fetching");
        }

        setSelectedRoom(smplrClient);

        const polygons = space?.assetmap.filter(
          (asset) => asset.type === "polygon"
        );

        if (polygons && polygons.length > 0) {
          setData(polygons[0].assets);
        }

        if (furnitures && furnitures.length > 0) {
          setFurniture(furnitures);
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
        throw error; // Propagate error to initViewer for cleanup
      }
    },
    [floors, selectedFloor, selectedProjects]
  );

  const getColor = (d) => {
    let statusLabel = "";

    switch (d.status) {
      case "occupied_by_tenant":
      case "occupied_by_owner":
      case "shifting":
        statusLabel = "Occupied";
        break;
      case "vacant":
        statusLabel = "Vacant";
        break;
      case "not_ready":
        statusLabel = "Not Ready";
        break;
      case "under_notice":
        statusLabel = "Under Notice";
        break;
      default:
        statusLabel = "Unknown";
    }
    const statusObj = OccupancyStatuses.find(
      (status) => status.label === statusLabel
    );

    if (onClickStatus !== "All") {
      return statusLabel === onClickStatus ? statusObj?.color : "#8C8C8C";
    } else {
      return d.isSelected
        ? darkenColor(
            d.facilityId ? "#FF8C00" : statusObj?.color || "#8C8C8C",
            0.4
          )
        : d.facilityId
        ? "#FF8C00"
        : statusObj?.color || "#8C8C8C";
    }
  };

  const addDataLayer = useCallback(() => {
    if (!spaceRef.current || data.length === 0) return;

    const updatedDataLayer = data
      .map((item) => {
        const matchingUnit = units.find(
          (unit) => item?.id === unit?.smplrSpaceData?.objectId
        );

        const matchingFacility = facilities.find(
          (facility) => item?.id === facility?.smplrSpaceData?.objectId
        );

        return {
          ...item,
          status: matchingUnit?.status,
          unitId: matchingUnit?._id,
          buildUpArea: matchingUnit?.buildUpArea,
          numberOfSeats: matchingUnit?.numberOfSeats,
          facilityId: matchingFacility?._id,
          facilityName: matchingFacility?.name,
          unitName: matchingUnit?.name,
          isSelected:
            item.id === selectedUnits?.smplrSpaceData?.objectId ||
            item.id === selectedFacilities?.smplrSpaceData?.objectId,
        };
      })
      .filter((item) => {
        const hasRequiredId = item.unitId || item.facilityId;

        if (onClickStatus !== "All") {
          const mappedStatus = statusMapping[item.status] || "Unknown";
          return hasRequiredId && mappedStatus === onClickStatus;
        }

        return hasRequiredId;
      });

    const filterData = data.filter(
      (item) =>
        item.id === selectedUnits?.smplrSpaceData?.objectId ||
        item.id === selectedFacilities?.smplrSpaceData?.objectId
    );

    // Mapped Furniture Layer
    // const updatedDataLayerFurniture = furniture
    //   .map((item) => {
    //     const matchingUnit = units.find(
    //       (unit) => item?.id === unit?.smplrSpaceData?.objectId
    //     );

    //     const matchingFacility = facilities.find(
    //       (facility) => item?.id === facility?.smplrSpaceData?.objectId
    //     );

    //     return {
    //       ...item,
    //       status: matchingUnit?.status,
    //       unitId: matchingUnit?._id,
    //       facilityId: matchingFacility?._id,
    //       facilityName: matchingFacility?.name,
    //       unitName: matchingUnit?.name,
    //       isSelected:
    //         item.id === selectedUnits?.smplrSpaceData?.objectId ||
    //         item.id === selectedFacilities?.smplrSpaceData?.objectId,
    //     };
    //   })
    //   .filter((item) => {
    //     const hasRequiredId = item.unitId || item.facilityId;
    //     if (onClickStatus !== "All") {
    //       const mappedStatus = statusMapping[item.status] || "Unknown";
    //       return hasRequiredId && mappedStatus === onClickStatus;
    //     }

    //     return hasRequiredId;
    //   });

    const updatedDataLayerFurniture = furniture
      .map((item) => {
        const matchingUnit = units.find(
          (unit) => item?.id === unit?.smplrSpaceData?.objectId
        );

        const matchingFacility = facilities.find(
          (facility) => item?.id === facility?.smplrSpaceData?.objectId
        );

        return {
          ...item,
          status: matchingUnit?.status,
          unitId: matchingUnit?._id,
          buildUpArea: matchingUnit?.buildUpArea,
          numberOfSeats: matchingUnit?.numberOfSeats,
          facilityId: matchingFacility?._id,
          facilityName: matchingFacility?.name,
          unitName: matchingUnit?.name,
          isSelected:
            item.id === selectedUnits?.smplrSpaceData?.objectId ||
            item.id === selectedFacilities?.smplrSpaceData?.objectId,
        };
      })
      .filter((item) => {
        const hasRequiredId = item.unitId || item.facilityId;

        if (onClickStatus !== "All") {
          const mappedStatus = statusMapping[item.status] || "Unknown";
          return hasRequiredId && mappedStatus === onClickStatus;
        }

        return hasRequiredId;
      });

    const roomCenterPoint =
      filterData.length > 0
        ? selectedRoom?.getPolygonCenter({
            polygon: filterData[0]?.coordinates,
          })
        : null;

    if (roomCenterPoint) {
      const currentPlacement = spaceRef?.current.getCameraPlacement();

      spaceRef?.current.setCameraPlacement({
        alpha: currentPlacement.alpha,
        beta: currentPlacement.beta,
        radius: 130,
        target: {
          x: roomCenterPoint?.x,
          y: 10,
          z: roomCenterPoint?.z,
        },
        animate: true,
        animationDuration: 1,
      });
    }

    if (furniture.length > 0) {
      spaceRef.current.addFurnitureDataLayer({
        id: "furniture",
        type: "furniture",
        data: updatedDataLayerFurniture.map((item) => ({
          ...item,
          id: item.id,
          furnitureId: item.id,
        })),
        color: (d) => getColor(d),
        onClick: (d) => {
          if (d.unitId) {
            handleSelectedUnits({
              name: d.unitName,
              _id: d.unitId,
              smplrSpaceData: {
                objectId: d.id,
                index: d.levelIndex,
              },
              buildUpArea: d.buildUpArea,
              numberOfSeats: d.numberOfSeats,
              status: d.status,
            });
            handleSelectedFacilities(null);
          } else if (d.facilityId) {
            handleSelectedFacilities({
              name: d.facilityName,
              _id: d.facilityId,
              smplrSpaceData: {
                objectId: d.id,
                index: d.levelIndex,
              },
            });
            handleSelectedUnits(null);
          } else {
            handleSelectedUnits(null);
            handleSelectedFacilities(null);
          }
          handleTicketsOnSpace([]);
          handleSelectedFloor(d.levelIndex);
          spaceRef?.current.showUpToLevel(d.levelIndex);
        },
        tooltip: (d) => d.isSelected && getTooltipHtml(d),
        persistentTooltip: true,
        tooltipContainerStyle: tooltipContainerStyle,
        // onHover: (d) => d,
      });
    }

    // Add room data layer
    spaceRef.current.addPolygonDataLayer({
      id: "rooms",
      type: "polygon",
      data: updatedDataLayer,
      onClick: (d) => {
        if (d.unitId) {
          handleSelectedUnits({
            name: d.unitName,
            _id: d.unitId,
            smplrSpaceData: {
              objectId: d.id,
              index: d.levelIndex,
            },
            buildUpArea: d.buildUpArea,
            numberOfSeats: d.numberOfSeats,
            status: d.status,
          });
          handleSelectedFacilities(null);
        } else if (d.facilityId) {
          handleSelectedFacilities({
            name: d.facilityName,
            _id: d.facilityId,
            smplrSpaceData: {
              objectId: d.id,
              index: d.levelIndex,
            },
          });
          handleSelectedUnits(null);
        } else {
          handleSelectedUnits(null);
          handleSelectedFacilities(null);
        }

        // handleOnClickStatus("All");
        handleTicketsOnSpace([]);
        handleSelectedFloor(d.levelIndex);
        spaceRef?.current.showUpToLevel(d.levelIndex);

        const roomCenter = selectedRoom?.getPolygonCenter({
          polygon: d.coordinates,
        });
        const currentPlacement = spaceRef.current.getCameraPlacement();
        spaceRef.current.setCameraPlacement({
          alpha: currentPlacement.alpha,
          beta: currentPlacement.beta,
          radius: 130,
          target: {
            x: roomCenter.x,
            y: 10,
            z: roomCenter.z,
          },
          animate: true,
          animationDuration: 1,
        });
      },
      tooltip: (d) => d.isSelected && getTooltipHtml(d),
      persistentTooltip: true,
      tooltipContainerStyle: tooltipContainerStyle,
      // onHover: (d) => d,
      color: (d) => getColor(d),
      alpha: 1,
      height: 2,
    });

    setDataLayer([...updatedDataLayer, ...updatedDataLayerFurniture]);
  }, [
    data,
    units,
    facilities,
    selectedUnits,
    onClickStatus,
    selectedFacilities,
    selectedRoom,
  ]);

  useEffect(() => {
    if (selectedTab !== "Tickets") return;
    if (ticketsOnSpace?.length === 0) {
      return;
    }

    let addedLayerIds = [];

    const filteredTickets = ticketsOnSpace
      .map((ticket) => ({
        ...ticket,
        tickets: ticket.tickets.filter(
          (t) => ticketStatusFilter === "" || t.status === ticketStatusFilter
        ),
        ticketCount: ticket.tickets.filter(
          (t) => ticketStatusFilter === "" || t.status === ticketStatusFilter
        ).length,
      }))
      .filter((ticket) => ticket.ticketCount > 0);

    const updatedDataLayer = dataLayer.map((item) => {
      const matchedTicket = filteredTickets.find(
        (ticket) => ticket?.smplrSpaceData?.objectId === item.id
      );

      return {
        ...item,
        ticketCount: matchedTicket?.ticketCount || 0,
      };
    });

    const updatedDataLayerWithTickets = updatedDataLayer.filter(
      (item) => item.ticketCount > 0
    );

    if (!selectedUnits && !selectedFacilities) {
      spaceRef?.current?.centerCamera();
    }

    if (updatedDataLayerWithTickets.length > 0) {
      updatedDataLayerWithTickets.forEach((item) => {
        if (!addedLayerIds.includes(item.id)) {
          const svgUri = generateSvgDataUri(item.ticketCount);

          const centerIconPosition =
            !item.catalogId &&
            selectedRoom.getPolygonCenter({
              polygon: item.coordinates,
            });

          spaceRef.current.addIconDataLayer({
            id: item.id,
            type: "icon",
            data: [
              {
                id: item.id,
                position: {
                  levelIndex: centerIconPosition.levelIndex || item.levelIndex,
                  x: centerIconPosition.x || item.x,
                  z: centerIconPosition.z || item.z,
                  elevation: 8,
                },
              },
            ],
            icon: {
              url: svgUri,
              width: 70,
              height: 70,
            },
            width: 10,
            color: "#973bed",
            anchor: "center",
            disableElevationCorrection: true,
          });

          addedLayerIds.push(item.id);
        }
      });
    }

    return () => {
      addedLayerIds.forEach((id) => {
        spaceRef.current.removeDataLayer(id);
      });
      addedLayerIds = [];
    };
  }, [ticketsOnSpace, ticketStatusFilter]);

  return (
    <Box className="smplr-wrapper">
      <Box className="smplr-embed" id="test"></Box>
      <Box sx={{ ...styles.containerBox }}>
        {selectedTab === "Overview"
          ? OccupancyStatuses.map(({ color, label }, index) => (
              <Box key={label + index}>
                <Button
                  variant="outlined"
                  sx={{
                    ...styles.btnStyle,
                    ...(label !== onClickStatus && styles.disabledBtnStyle),
                  }}
                  onClick={() => {
                    handleOnClickStatus(label);
                    handleSelectedUnits(null);
                    handleSelectedFacilities(null);
                    spaceRef?.current.centerCamera();
                  }}
                >
                  <Box
                    sx={{
                      ...styles.statusBox,
                      backgroundColor: color || "transparent",
                      display: color ? "block" : "none",
                      marginRight: color ? 1 : 0,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: color ? "left" : "center",
                      flexGrow: 1,
                    }}
                  >
                    {label}
                  </Typography>
                </Button>
              </Box>
            ))
          : ticketsStatusData.map(({ label, value }, index) => (
              <Box key={label + index}>
                <Button
                  variant="outlined"
                  sx={{
                    ...styles.btnStyle,
                    ...(value !== ticketStatusFilter &&
                      styles.disabledBtnStyle),
                  }}
                  onClick={() => {
                    handleTicketStatusFilter(value);
                  }}
                >
                  <Typography variant="body2">{label}</Typography>
                </Button>
              </Box>
            ))}
      </Box>
    </Box>
  );
};

export default React.memo(Space);
