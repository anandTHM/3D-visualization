import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  TablePagination,
  Modal,
  Button,
  TextField,
  TableFooter,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import { useSpace } from "../store";
import { get } from "../service";
import EastIcon from "@mui/icons-material/East";
import WestIcon from "@mui/icons-material/West";
import AppLoader from "./AppLoader";

const tableHeader = ["ObjectId", "Object Name", "Select Unit"];

const style = {
  position: "absolute",
  top: "50%",
  left: "30%",
  transform: "translate(-50%, -70%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
};

const cardStyle = {
  margin: "8px",
  height: "40px",
  width: "auto",
};

const cardHeaderStyle = {
  backgroundColor: "#E0E0E0",
  // borderBottom: "1px solid #ccc",
  fontSize: "13px",
  display: "flex",
};

const CustomTable = ({ tableData }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isOpen, setIsOpen] = useState(false);
  const [radioButton, setRadioButton] = useState("Units");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModalItem, setSelectedModalItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [editingRowObjectId, setEditingRowObjectId] = useState(null);
  const [alreadySelectedIds, setAlreadySelectedIds] = useState(new Set());

  const [modalPage, setModalPage] = useState(1);
  const {
    state,
    handleAllUnitsAndFacilities,
    handleSelectedItems,
    handleUpdatedSelectedItems,
    handleSelectedObjectId,
  } = useSpace();
  const {
    projectId,
    selectedFloor,
    authToken,
    allUnitsAndFacilities,
    mappedPolygons,
    selectedObjectId,
  } = state;

  useEffect(() => {
    const transformedData = mappedPolygons?.reduce((acc, item) => {
      const objectId = item?.smplrSpaceData?.objectId;
      acc[objectId] = { ...item };
      return acc;
    }, {});

    setSelectedItems(transformedData);

    const selectedIdsFromMappedPolygons = new Set(
      mappedPolygons.map((polygon) => polygon._id)
    );

    handleSelectedItems(transformedData);

    const selectedIdsFromItems = new Set(
      Object.values(transformedData)
        .filter((item) => item !== null)
        .map((item) => item._id)
    );

    const combinedSelectedIds = new Set([
      ...selectedIdsFromItems,
      ...selectedIdsFromMappedPolygons,
    ]);

    setAlreadySelectedIds(combinedSelectedIds);
  }, [mappedPolygons]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await get(
        `/digital-twin/units-and-facilities`,
        {
          projectId,
          type: radioButton.toLowerCase(),
          q: searchQuery.toLowerCase(),
          floorIndex: selectedFloor - 1,
          page: modalPage,
          limit: 5,
        },
        authToken
      );
      if (response.status === 200) {
        setLoading(false);
        handleAllUnitsAndFacilities(response.data);
      }
    };
    fetchData();
  }, [radioButton, searchQuery, modalPage]);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const paginatedData = useMemo(
    () => tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [tableData, page, rowsPerPage]
  );

  const handleRadioChange = (event) => {
    setRadioButton(event.target.value);
  };

  const handleNextModalPage = () => {
    if (modalPage * 5 < allUnitsAndFacilities.count) {
      setModalPage((prev) => prev + 1);
    }
  };

  const handlePreviousModalPage = () => {
    if (modalPage > 1) {
      setModalPage((prev) => prev - 1);
    }
  };

  const onOpenModalHandler = (rowObjectId) => {
    const type = selectedItems[rowObjectId]?.name ? "Facilities" : "Units";
    handleSelectedObjectId(rowObjectId);
    setRadioButton(type);
    setIsOpen(true);
    setEditingRowObjectId(rowObjectId);
    setSelectedModalItem(selectedItems[rowObjectId] || null);
  };

  const handleClose = () => {
    setIsOpen(false);
    handleSelectedObjectId("");
    setSelectedModalItem(selectedItems[editingRowObjectId] || null);
    setEditingRowObjectId(null);
    setSearchQuery("");
  };

  const handleSelectModalItem = (item) => {
    if (selectedModalItem && selectedModalItem._id === item._id) {
      setSelectedModalItem(null);
    } else {
      setSelectedModalItem({
        ...item,
        objectId: editingRowObjectId,
        type: radioButton.toLowerCase(),
        id: item._id,
      });
    }
  };

  // const handleSubmit = () => {
  //   setSelectedItems((prev) => {
  //     const newSelectedItems = { ...prev };

  //     if (selectedModalItem) {
  //       // Get the current stored item for this row
  //       const previousSelectedItem = prev[editingRowObjectId];

  //       // Compare with selectedModalItem to check for changes
  //       const isItemChanged =
  //         !previousSelectedItem ||
  //         previousSelectedItem._id !== selectedModalItem._id ||
  //         previousSelectedItem.objectId !== editingRowObjectId;

  //       if (isItemChanged) {
  //         // Save only if the item has been edited or newly selected
  //         newSelectedItems[editingRowObjectId] = {
  //           ...selectedModalItem,
  //           objectId: editingRowObjectId, // Ensure objectId is added
  //           type: radioButton.toLowerCase(), // Ensure type is added
  //           id: selectedModalItem._id, // Ensure id is added
  //           index: selectedFloor - 1,
  //         };

  //         // Update alreadySelectedIds
  //         setAlreadySelectedIds((prevIds) => {
  //           const updatedIds = new Set(prevIds);

  //           // Remove the previous selection if it existed
  //           if (
  //             previousSelectedItem &&
  //             previousSelectedItem._id !== selectedModalItem._id
  //           ) {
  //             updatedIds.delete(previousSelectedItem._id);
  //           }

  //           // Add the new selection
  //           updatedIds.add(selectedModalItem._id);

  //           return updatedIds;
  //         });
  //       }
  //     } else {
  //       // Remove the selection if nothing is selected
  //       const previousSelectedItem = newSelectedItems[editingRowObjectId];
  //       if (previousSelectedItem) {
  //         setAlreadySelectedIds((prevIds) => {
  //           const updatedIds = new Set(prevIds);
  //           updatedIds.delete(previousSelectedItem._id);
  //           return updatedIds;
  //         });
  //       }
  //       delete newSelectedItems[editingRowObjectId];
  //     }

  //     // Filter out items with `smplrSpaceData`
  //     const filteredSelectedItems = Object.entries(newSelectedItems)
  //       .filter(([key, value]) => !value.smplrSpaceData)
  //       .reduce((acc, [key, value]) => {
  //         acc[key] = value;
  //         return acc;
  //       }, {});

  //     // Move updated or added item to the end of the object
  //     const reorderedSelectedItems = {};
  //     Object.keys(newSelectedItems)
  //       .filter((key) => key !== editingRowObjectId) // Keep all items except the updated one
  //       .forEach((key) => {
  //         reorderedSelectedItems[key] = newSelectedItems[key];
  //       });

  //     // Add the updated item at the end
  //     if (newSelectedItems[editingRowObjectId]) {
  //       reorderedSelectedItems[editingRowObjectId] =
  //         newSelectedItems[editingRowObjectId];
  //     }

  //     // Propagate the changes to parent handler
  //     handleUpdatedSelectedItems(filteredSelectedItems);
  //     handleSelectedItems(reorderedSelectedItems);

  //     console.log("Filtered Selected Items:", reorderedSelectedItems);

  //     return reorderedSelectedItems;
  //   });

  //   // Close the modal and reset the states
  //   setIsOpen(false);
  //   setSelectedModalItem(null);
  //   setEditingRowObjectId(null);
  // };

  // const handleSubmit = () => {
  //   setSelectedItems((prev) => {
  //     const newSelectedItems = { ...prev };

  //     if (selectedModalItem) {
  //       const previousSelectedItem = prev[editingRowObjectId];

  //       const isItemChanged =
  //         !previousSelectedItem ||
  //         previousSelectedItem._id !== selectedModalItem._id ||
  //         previousSelectedItem.objectId !== editingRowObjectId;

  //       if (isItemChanged) {
  //         newSelectedItems[editingRowObjectId] = {
  //           ...selectedModalItem,
  //           objectId: editingRowObjectId,
  //           type: radioButton.toLowerCase(),
  //           id: selectedModalItem._id,
  //           index: selectedFloor - 1,
  //           updated: !!previousSelectedItem, // Set updated to true if there was a previous item
  //         };

  //         setAlreadySelectedIds((prevIds) => {
  //           const updatedIds = new Set(prevIds);

  //           if (
  //             previousSelectedItem &&
  //             previousSelectedItem._id !== selectedModalItem._id
  //           ) {
  //             updatedIds.delete(previousSelectedItem._id);
  //           }

  //           updatedIds.add(selectedModalItem._id);

  //           return updatedIds;
  //         });
  //       } else {
  //         // Ensure the updated flag is false if there's no change
  //         newSelectedItems[editingRowObjectId] = {
  //           ...newSelectedItems[editingRowObjectId],
  //           updated: false,
  //         };
  //       }
  //     } else {
  //       const previousSelectedItem = newSelectedItems[editingRowObjectId];
  //       if (previousSelectedItem) {
  //         setAlreadySelectedIds((prevIds) => {
  //           const updatedIds = new Set(prevIds);
  //           updatedIds.delete(previousSelectedItem._id);
  //           return updatedIds;
  //         });
  //       }
  //       delete newSelectedItems[editingRowObjectId];
  //     }

  //     const filteredSelectedItems = Object.entries(newSelectedItems)
  //       .filter(([key, value]) => !value.smplrSpaceData)
  //       .reduce((acc, [key, value]) => {
  //         acc[key] = value;
  //         return acc;
  //       }, {});

  //     const reorderedSelectedItems = {};
  //     Object.keys(newSelectedItems)
  //       .filter((key) => key !== editingRowObjectId)
  //       .forEach((key) => {
  //         reorderedSelectedItems[key] = newSelectedItems[key];
  //       });

  //     if (newSelectedItems[editingRowObjectId]) {
  //       reorderedSelectedItems[editingRowObjectId] =
  //         newSelectedItems[editingRowObjectId];
  //     }

  //     handleUpdatedSelectedItems(filteredSelectedItems);
  //     handleSelectedItems(reorderedSelectedItems);

  //     console.log("Filtered Selected Items:", reorderedSelectedItems);

  //     return reorderedSelectedItems;
  //   });

  //   setIsOpen(false);
  //   setSelectedModalItem(null);
  //   setEditingRowObjectId(null);
  // };

  const handleSubmit = () => {
    setSelectedItems((prev) => {
      const newSelectedItems = { ...prev };

      if (selectedModalItem) {
        // Get the current stored item for this row
        const previousSelectedItem = prev[editingRowObjectId];

        // Find if the selected item is already mapped to another objectId
        const existingMappingEntry = Object.entries(prev).find(
          ([key, value]) =>
            key !== editingRowObjectId && value._id === selectedModalItem._id
        );

        // If this item is already mapped somewhere else, remove that mapping
        if (existingMappingEntry) {
          delete newSelectedItems[existingMappingEntry[0]];
        }

        // Create the new mapping or update the existing one
        newSelectedItems[editingRowObjectId] = {
          ...selectedModalItem,
          objectId: editingRowObjectId,
          type: radioButton.toLowerCase(),
          id: selectedModalItem._id,
          index: selectedFloor - 1,
          updated: previousSelectedItem ? true : false, // Set the updated flag
        };

        // Update alreadySelectedIds
        setAlreadySelectedIds((prevIds) => {
          const updatedIds = new Set(prevIds);

          // Remove the previous selection if it existed
          if (
            previousSelectedItem &&
            previousSelectedItem._id !== selectedModalItem._id
          ) {
            updatedIds.delete(previousSelectedItem._id);
          }

          // Add the new selection
          updatedIds.add(selectedModalItem._id);

          return updatedIds;
        });
      } else {
        // Remove the selection if nothing is selected
        const previousSelectedItem = newSelectedItems[editingRowObjectId];
        if (previousSelectedItem) {
          setAlreadySelectedIds((prevIds) => {
            const updatedIds = new Set(prevIds);
            updatedIds.delete(previousSelectedItem._id);
            return updatedIds;
          });
        }
        delete newSelectedItems[editingRowObjectId];
      }

      // Create a properly filtered version that excludes smplrSpaceData items
      const filteredSelectedItems = Object.entries(newSelectedItems)
        .filter(([_, value]) => !value.smplrSpaceData)
        .reduce((acc, [key, value]) => {
          // Ensure we're creating a new object with all necessary properties
          acc[key] = {
            ...value,
            objectId: key,
            type: value.type || radioButton.toLowerCase(),
            id: value._id,
            index: value.index || selectedFloor - 1,
          };
          return acc;
        }, {});

      // Create reordered items maintaining the latest changes
      const reorderedSelectedItems = {};

      // First add all items except the currently edited one
      Object.keys(newSelectedItems)
        .filter((key) => key !== editingRowObjectId)
        .forEach((key) => {
          reorderedSelectedItems[key] = newSelectedItems[key];
        });

      // Then add the edited item at the end if it exists
      if (newSelectedItems[editingRowObjectId]) {
        reorderedSelectedItems[editingRowObjectId] =
          newSelectedItems[editingRowObjectId];
      }

      // Log the state before propagating changes

      // Propagate the changes to parent handlers
      handleUpdatedSelectedItems(filteredSelectedItems);
      handleSelectedItems(reorderedSelectedItems);

      return reorderedSelectedItems;
    });

    // Reset states and close modal
    setIsOpen(false);
    setSelectedModalItem(null);
    setEditingRowObjectId(null);
  };

  return (
    <Box sx={{ p: 2 }}>
      <TableContainer component={Paper} sx={{ border: "1px solid #C9CFD9" }}>
        <Table size="small" aria-label="custom dense table">
          <TableHead sx={{ backgroundColor: "#F6F6F6" }}>
            <TableRow>
              {tableHeader.map((header, index) => (
                <TableCell
                  key={`header-${index}`}
                  sx={{ color: "#757575", fontSize: "12px", py: 1.5 }}
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
              paginatedData.map((row) => (
                <TableRow
                  key={row.objectId}
                  sx={
                    {
                      // backgroundColor:
                      //   row.objectId === selectedObjectId ? "#F6F6F6" : "inherit",
                    }
                  }
                >
                  <TableCell
                    sx={{
                      color: "rgba(0, 0, 0, .87);",
                      fontSize: "13px",
                      width: "300px",
                    }}
                  >
                    {row.objectId}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "rgba(0, 0, 0, .87);",
                      fontSize: "13px",
                      width: "120px",
                    }}
                  >
                    {row.objectName}
                  </TableCell>
                  {/* <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "start",
                        justifyContent: "start",
                      }}
                    >
                      {selectedItems[row.objectId] && (
                        <Typography
                          variant="caption"
                          color="#000000"
                          sx={{ fontSize: "14px" }}
                        >
                          {selectedItems[row.objectId].block ||
                            selectedItems[row.objectId].name}
                        </Typography>
                      )}

                      {selectedItems[row.objectId] ? (
                        <EditIcon
                          sx={{ mr: 1, fontSize: 22, cursor: "pointer" }}
                          onClick={() => onOpenModalHandler(row.objectId)}
                        />
                      ) : (
                        <AddIcon
                          sx={{ mr: 1, fontSize: 22, cursor: "pointer" }}
                          onClick={() => onOpenModalHandler(row.objectId)}
                        />
                      )}
                    </Box>
                  </TableCell> */}

                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #D6D6D6",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          p: 0.2,
                          fontSize: "13px",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          color: "rgba(0, 0, 0, .87);",
                        }}
                      >
                        {selectedItems[row.objectId]?.unitAddress ||
                          selectedItems[row.objectId]?.name ||
                          ""}
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {selectedItems[row.objectId] ? (
                          <EditIcon
                            sx={{ fontSize: 22, cursor: "pointer", ml: 2 }}
                            onClick={() => onOpenModalHandler(row.objectId)}
                          />
                        ) : (
                          <AddIcon
                            sx={{ fontSize: 22, cursor: "pointer", ml: 2 }}
                            onClick={() => onOpenModalHandler(row.objectId)}
                          />
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[]}
                colSpan={tableHeader.length}
                count={tableData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  color: "#757575",
                  fontSize: "13px",
                  ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                    {
                      color: "#757575",
                      fontWeight: "normal",
                      fontSize: "13px",
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

      <Modal
        open={isOpen}
        // onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              background: "#FFF59D",
              padding: "8px",
              borderRadius: "8px",
            }}
          >
            <Grid container alignItems="center" spacing={2}>
              <Grid item size={11}>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Search For Unit"
                  variant="outlined"
                  size="small"
                  sx={{
                    background: "#fff",

                    height: "40px",
                    fontSize: "13px",

                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#D6D6D6",
                      },
                      "&:hover fieldset": {
                        borderColor: "#D6D6D6",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#D6D6D6",
                      },
                    },

                    "& .MuiInputLabel-root": {
                      color: "#848484",
                      fontWeight: "normal",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#848484",
                    },
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Grid>
              <Grid item size={1}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "flex-end",
                    gap: "8px",
                  }}
                >
                  <ClearIcon
                    sx={{
                      cursor: "pointer",
                      height: 30,
                      width: 30,
                    }}
                    onClick={() => {
                      setSearchQuery("");
                      handleClose();
                    }}
                  />

                  {/* <Button
                    variant="outlined"
                    sx={{
                      background: "#fff",
                      color: "#000",
                      boxShadow: 3,
                      "&:hover": {
                        background: "#fff",
                        borderColor: "transparent",
                      },
                    }}
                    // onClick={fetchUnitsandFacility}
                  >
                    Search
                  </Button> */}
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ background: "#EEEEEE" }}>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                sx={{ paddingLeft: "12px" }}
                value={radioButton}
                onChange={handleRadioChange}
              >
                <FormControlLabel
                  value="Units"
                  control={<Radio size="small" />}
                  label={<span style={{ fontSize: "13px" }}>Units</span>}
                />
                <FormControlLabel
                  value="Facilities"
                  control={<Radio size="small" />}
                  label={<span style={{ fontSize: "13px" }}>Facilities</span>}
                />
              </RadioGroup>
            </FormControl>
          </Box>

          <Box sx={{ ...cardStyle }}>
            <Typography sx={{ ...cardHeaderStyle, padding: "8px" }}>
              {radioButton}
            </Typography>
          </Box>

          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
              }}
            >
              <AppLoader thickness={5} size={30} color="#000000" />
            </Box>
          ) : allUnitsAndFacilities?.rows?.length > 0 ? (
            allUnitsAndFacilities?.rows?.map((item) => {
              const isSelected =
                selectedModalItem && selectedModalItem._id === item._id;
              const isDisabled =
                alreadySelectedIds.has(item._id) && !isSelected;

              return (
                <Box
                  key={item._id}
                  sx={{
                    ...cardStyle,
                    boxShadow: 3,
                    background: isSelected
                      ? "#7E1946"
                      : isDisabled
                      ? "#E0E0E0"
                      : "#FFFFFF",
                    color: isSelected
                      ? "#FFFFFF"
                      : isDisabled
                      ? "#393939"
                      : "#000",
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    opacity: isDisabled ? 0.7 : 1,
                  }}
                  onClick={() => !isDisabled && handleSelectModalItem(item)}
                >
                  <Typography
                    sx={{
                      ...cardHeaderStyle,
                      padding: "8px",
                      background: isSelected
                        ? "#7E1946"
                        : isDisabled
                        ? "#E0E0E0"
                        : "#fff",
                      color: isSelected
                        ? "#FFFFFF"
                        : isDisabled
                        ? "#999"
                        : "#000",
                    }}
                  >
                    {item?.unitAddress
                      ? item.unitAddress
                      : item.name
                      ? item.name
                      : "No Name"}
                  </Typography>
                </Box>
              );
            })
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
              }}
            >
              <Typography variant="body1">No Data Found</Typography>
            </Box>
          )}

          <Box
            sx={{
              background: "#EEEEEE",
              padding: "8px",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <WestIcon
                sx={{
                  cursor: modalPage > 1 ? "pointer" : "not-allowed",
                  height: 22,
                  width: 22,
                  marginRight: "10px",
                  opacity: modalPage > 1 ? 1 : 0.5,
                  transition: "opacity 0.3s ease",
                }}
                onClick={handlePreviousModalPage}
              />
              <EastIcon
                sx={{
                  cursor:
                    modalPage * 5 < allUnitsAndFacilities.count
                      ? "pointer"
                      : "not-allowed",
                  height: 22,
                  width: 22,
                  opacity:
                    modalPage * 5 < allUnitsAndFacilities.count ? 1 : 0.5,
                  transition: "opacity 0.3s ease",
                }}
                onClick={handleNextModalPage}
              />
              <Typography sx={{ mx: 1, fontSize: "14px" }}>
                {Math.min(modalPage * 5, allUnitsAndFacilities.count)} /{" "}
                {allUnitsAndFacilities.count}
              </Typography>
            </Box>

            <Box sx={{ display: "flex" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: "##EEEEEE",
                    cursor: "pointer",
                    mr: 2,
                    fontSize: "14px",
                  }}
                  onClick={handleClose}
                >
                  Cancel
                </Typography>
              </Box>
              <Button
                variant="contained"
                sx={{
                  background: "#FFFFFF",
                  color: "#000000",
                  boxShadow: 3,
                  fontSize: "14px",
                  "&:hover": {
                    background: "#FFFFFFF",
                    borderColor: "transparent",
                  },
                }}
                disabled={!selectedModalItem}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default React.memo(CustomTable);
