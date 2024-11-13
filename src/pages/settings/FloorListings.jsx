import { useEffect, useState, useMemo, useCallback } from "react";
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

const tableStyles = {
  headerCell: {
    color: "#757575",
    fontSize: "12px",
    py: 2,
    textAlign: "center",
  },
  dataCell: {
    color: "rgba(0, 0, 0, .87)",
    fontSize: "13px",
    py: 1.5,
    textAlign: "center",
  },
  paginationStyles: {
    color: "#757575",
    fontSize: "12px",
    ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
      color: "#757575",
      fontWeight: "normal",
      fontSize: "12px",
    },
    ".MuiTablePagination-actions": {
      color: "#757575",
    },
  },
};

const ErrorMessage = ({ message }) => (
  <Box sx={{ p: 2, color: "red" }}>{message}</Box>
);

const CustomTable = React.memo(
  ({ tableHeader, tableData, mappedPolygons, onClick }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = useCallback((event, newPage) => {
      setPage(newPage);
    }, []);

    const handleChangeRowsPerPage = useCallback((event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    }, []);

    const paginatedData = useMemo(
      () =>
        tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
      [tableData, page, rowsPerPage]
    );

    const renderTableRow = useCallback(
      (item, index) => {
        const polygon = mappedPolygons.find((p) => p.index === item.floor - 1);
        const polygonsLength = polygon ? polygon.length : 0;

        return (
          <TableRow key={`row-${index}`}>
            <TableCell sx={{ ...tableStyles.dataCell, width: 300 }}>
              Floor {item.floor}
            </TableCell>
            <TableCell sx={{ ...tableStyles.dataCell, width: 400 }}>
              {polygonsLength} / {item.floorData.length || 0}
            </TableCell>
            <TableCell sx={{ ...tableStyles.dataCell, width: 500 }}>
              {polygonsLength === 0 ? (
                <AppButton
                  variant="contained"
                  labelText="Setup"
                  backgroundColor="#F4F4F4"
                  color="#444444"
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
      },
      [mappedPolygons, onClick]
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
                <TableCell key={`header-${index}`} sx={tableStyles.headerCell}>
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
              paginatedData.map(renderTableRow)
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
                sx={tableStyles.paginationStyles}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    );
  }
);

const FloorListings = () => {
  const [loadingSpaceData, setLoadingSpaceData] = useState(true);
  const [error, setError] = useState("");
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [enteredFloor, setEnteredFloor] = useState("");

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
    loadingMappedData,
  } = state;

  const tableHeader = useMemo(() => ["Floor", "Mapped Polygons", "Edit"], []);

  const fetchMappedData = useCallback(async () => {
    if (!projectId) return;

    handleLoadMappedData(true);
    setError("");

    try {
      const queryParams = new URLSearchParams({ projectId }).toString();
      const response = await get(
        `/digital-twin/mapped-facilities-and-units?${queryParams}`,
        {},
        authToken
      );

      const transformedData = response.data.reduce((acc, item) => {
        const index = item.smplrSpaceData.index;
        if (!acc[index]) {
          acc[index] = { index, length: 0 };
        }
        acc[index].length += 1;
        return acc;
      }, {});

      handleMappedPolygons(Object.values(transformedData));
    } catch (err) {
      console.error("Error fetching mapped data:", err);
      setError("Failed to fetch mapped data. Please try again.");
    } finally {
      handleLoadMappedData(false);
    }
  }, [projectId, authToken, handleMappedPolygons, handleLoadMappedData]);

  const loadSpaceData = useCallback(async () => {
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

      const [space, furnitures] = await Promise.all([
        spaceData.getSpace(enterSpaceId),
        spaceData.getAllFurnitureInSpace(enterSpaceId),
      ]);

      if (!space) throw new Error("Invalid enterSpaceId or space not found");

      const polygons = space?.assetmap?.find((item) => item.type === "polygon");
      if (!polygons) throw new Error("No polygons found in the space");

      const floorWiseData = {};

      [...polygons.assets, ...furnitures].forEach((item) => {
        const floor = (item.levelIndex || 0) + 1;
        if (!floorWiseData[floor]) floorWiseData[floor] = [];

        floorWiseData[floor].push({
          type: item.type || "furniture",
          objectId: item.id,
          objectName: item.name,
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
  }, [enterSpaceId, handleFloorWisePolygons]);

  useEffect(() => {
    fetchMappedData();
  }, [fetchMappedData]);

  useEffect(() => {
    loadSpaceData();
  }, [loadSpaceData]);

  const onClickViewer = useCallback(
    async (data) => {
      handleSelectedFloorData(data);
      handleLoadMappedData(true);
      navigate("/floor-mapping-units");

      try {
        const response = await get(
          `/digital-twin/mapped-facilities-and-units`,
          {
            floorIndex: data.floor - 1,
            projectId,
          },
          authToken
        );

        if (response.status === 200) {
          handleMappedPolygons(response.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        handleLoadMappedData(false);
      }
    },
    [
      handleSelectedFloorData,
      handleLoadMappedData,
      navigate,
      projectId,
      authToken,
      handleMappedPolygons,
    ]
  );

  const filteredTableData = useMemo(
    () =>
      floorWisePolygons.filter((item) => {
        if (!enteredFloor && !selectedFloor) return true;
        return (
          (enteredFloor && item?.floor === Number(enteredFloor)) ||
          (selectedFloor && item?.floor === Number(selectedFloor) + 1)
        );
      }),
    [floorWisePolygons, enteredFloor, selectedFloor]
  );

  if (loadingMappedData || loadingSpaceData) return <AppLoader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      <AppToolBar
        showProperty={true}
        mapped={true}
        floorWisePolygons={floorWisePolygons}
        selectedFloor={selectedFloor}
        enteredFloor={enteredFloor}
        onChangeInputHandler={(e) => setEnteredFloor(e.target.value)}
        onChangeDropdownHandler={(e) => setSelectedFloor(e.target.value)}
        onClickBackHandler={() => {
          window.parent.location.href = `${baseUrl}/godview/#/settings/digital-twin-mapping`;
        }}
      />
      <Box sx={{ p: 2 }}>
        <CustomTable
          tableHeader={tableHeader}
          tableData={filteredTableData}
          mappedPolygons={mappedPolygons}
          onClick={onClickViewer}
        />
      </Box>
    </>
  );
};

export default FloorListings;
