import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { loadSmplrJs } from "@smplrspace/smplr-loader";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  TableFooter,
  TablePagination,
} from "@mui/material";

import { useSpace } from "../../store";
import edit from "../../assets/edit.svg";
import { get } from "../../service";
import { config } from "../../utils";
import AppButton from "../../components/AppButton";
import { baseUrl } from "../../utils/helper";
import AppToolBar from "../../components/AppToolbar";
import AppLoader from "../../components/AppLoader";

const CustomTable = ({ tableHeader, tableData, mappedPolygons, onClick }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = tableData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <TableContainer component={Paper}>
      <Table
        sx={{ minWidth: 650 }}
        size="small"
        aria-label="custom dense table"
      >
        <TableHead sx={{ backgroundColor: "#F6F6F6" }}>
          <TableRow>
            {tableHeader.map((header, index) => (
              <TableCell
                key={`header-${index}`}
                align="center"
                sx={{ color: "#757575", fontSize: "12px", py: 2 }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={tableHeader.length} align="center">
                No data found
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((item, index) => {
              const polygon = mappedPolygons.find(
                (p) => p.index === item.floor - 1
              );
              const polygonsLength = polygon ? polygon.length : 0;

              return (
                <TableRow key={`row-${index}`}>
                  <TableCell
                    align="center"
                    sx={{
                      color: "rgba(0, 0, 0, .87);",
                      fontSize: "13px",
                      py: 1.5,
                      width: 300,
                    }}
                  >
                    Floor {item.floor}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: "rgba(0, 0, 0, .87);",
                      fontSize: "13px",
                      py: 1.5,
                      width: 400,
                    }}
                  >
                    {polygonsLength} / {item.floorData.length || 0}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontSize: "13px", py: 1.5, width: 500 }}
                  >
                    {polygonsLength === 0 ? (
                      <AppButton
                        variant="contained"
                        labelText={"Setup"}
                        backgroundColor={"#F4F4F4"}
                        color={"#444444"}
                        onClick={() => onClick(item)}
                      />
                    ) : (
                      <img
                        src={edit}
                        alt="Edit"
                        style={{ cursor: "pointer" }}
                        onClick={() => onClick(item)}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={tableHeader.length}
              count={tableData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Rows per page"
              sx={{
                color: "#757575",
                fontSize: "12px",
                ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                  {
                    color: "#757575",
                    fontWeight: "normal",
                    fontSize: "12px",
                  },
                ".MuiTablePagination-actions": {
                  color: "#757575",
                },
              }}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

const FloorListings = () => {
  const [loadingSpaceData, setLoadingSpaceData] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {
    state,
    handleMappedPolygons,
    handleFloorWisePolygons,
    handleSelectedFloorData,
    handleLoadMappedData,
  } = useSpace();

  const {
    floorWisePolygons,
    mappedPolygons,
    projectId,
    authToken,
    enterSpaceId,
    floors,
    loadingMappedData,
  } = state;

  const tableHeader = ["Floor", "Mapped Polygons", "Edit"];

  const [selectedFloor, setSelectedFloor] = useState(null);
  const [enteredFloor, setEnteredFloor] = useState("");

  const onChangeDropdownHandler = (event) => {
    setSelectedFloor(event.target.value);
  };

  const onChangeInputHandler = (event) => {
    setEnteredFloor(event.target.value);
  };

  useEffect(() => {
    const fetchAllMappedData = async () => {
      if (projectId) {
        handleLoadMappedData(true);
        setError("");

        const queryParams = new URLSearchParams({ projectId }).toString();

        try {
          const response = await get(
            `/digital-twin/mapped-facilities-and-units?${queryParams}`,
            {},
            authToken
          );

          const transformedData = response.data.reduce((acc, item) => {
            const index = item.smplrSpaceData.index;
            if (!acc[index]) {
              acc[index] = { index: index, length: 0 };
            }
            acc[index].length += 1;
            return acc;
          }, {});

          const finalData = Object.values(transformedData);
          handleMappedPolygons(finalData);
        } catch (err) {
          console.error("Error fetching mapped data:", err);
          setError("Failed to fetch mapped data. Please try again.");
        } finally {
          handleLoadMappedData(false);
        }
      }
    };

    fetchAllMappedData();
  }, [projectId, authToken]);

  useEffect(() => {
    const loadSpaceData = async () => {
      if (!enterSpaceId) {
        setError("Invalid or missing enterSpaceId");
        return;
      }

      setLoadingSpaceData(true);

      try {
        const smplr = await loadSmplrJs("esm");
        const spaceData = new smplr.QueryClient({
          organizationId: config.organizationId,
          clientToken: config.clientToken,
        });

        const space = await spaceData.getSpace(enterSpaceId);
        if (!space) {
          throw new Error("Invalid enterSpaceId or space not found");
        }

        const furnitures = await spaceData.getAllFurnitureInSpace(enterSpaceId);

        const polygons = space?.assetmap?.filter(
          (item) => item.type === "polygon"
        )[0] || [];

        if (!polygons) {
          throw new Error("No polygons found in the space");
        }

        const floorWiseData = {};

        // Add polygon data
        polygons?.assets?.forEach((asset) => {
          const floor = asset.levelIndex + 1;
          if (!floorWiseData[floor]) {
            floorWiseData[floor] = [];
          }
          floorWiseData[floor].push({
            type: "polygon",
            objectId: asset.id,
            objectName: asset.name,
          });
        });

        // Add furniture data
        furnitures.forEach((furniture) => {
          const floor = furniture.levelIndex + 1;
          if (!floorWiseData[floor]) {
            floorWiseData[floor] = [];
          }
          floorWiseData[floor].push({
            type: "furniture",
            objectId: furniture.id,
            objectName: furniture.name,
          });
        });

        const floorWiseDataArray = Object.entries(floorWiseData).map(
          ([floor, floorData]) => ({
            floor: parseInt(floor),
            floorData,
          })
        );

        handleFloorWisePolygons(floorWiseDataArray);
      } catch (error) {
        console.error(error);
        setError("Error loading space data. Please check enterSpaceId.");
      } finally {
        setLoadingSpaceData(false);
      }
    };

    loadSpaceData();
  }, [enterSpaceId]);

  const onClickViewer = async (data) => {
    handleSelectedFloorData(data);
    handleLoadMappedData(true);
    navigate("/floor-mapping-units");
    const queryParam = {
      floorIndex: data.floor - 1,
      projectId: projectId,
    };

    try {
      const response = await get(
        `/digital-twin/mapped-facilities-and-units`,
        queryParam,
        authToken
      );

      if (response.status === 200) {
        handleMappedPolygons(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      handleLoadMappedData(false);
    }
  };

  if (loadingMappedData || loadingSpaceData) {
    return (
      <Box sx={{mt:10}}>
        <AppLoader thickness={5} size={40} color="#000000" />
      </Box>
    );
  }

  if (error) {
    return <Box sx={{ p: 2, color: "red" }}>{error}</Box>;
  }

  const tableData = floorWisePolygons.filter((item) => {
    if (!enteredFloor && !selectedFloor) {
      return true;
    }
    return (
      (enteredFloor && item?.floor === Number(enteredFloor)) ||
      (selectedFloor && item?.floor === Number(selectedFloor) + 1)
    );
  });

  return (
    <>
      <AppToolBar
        showProperty={true}
        mapped={true}
        floorWisePolygons={floorWisePolygons}
        selectedFloor={selectedFloor}
        enteredFloor={enteredFloor}
        onChangeInputHandler={onChangeInputHandler}
        onChangeDropdownHandler={onChangeDropdownHandler}
        onClickBackHandler={() => {
          const parentUrl = `${baseUrl}/godview/#/settings/digital-twin-mapping`;
          window.parent.location.href = parentUrl;
        }}
      />
      <Box sx={{ p: 2 }}>
        <CustomTable
          tableHeader={tableHeader}
          tableData={tableData}
          mappedPolygons={mappedPolygons}
          onClick={onClickViewer}
        />
      </Box>
    </>
  );
};

export default FloorListings;
