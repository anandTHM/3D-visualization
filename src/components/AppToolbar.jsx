import { Box, Typography, Toolbar as MuiToolbar } from "@mui/material";
import Grid from "@mui/material/Grid2";
import backIcon from "../assets/backIcon.svg";
import AppDropdown from "./AppDropdown";
import AppInputField from "./AppInputField";
import { useSpace } from "../store";
import { useDigitalTwin } from "../store/digitalTwin";

const styles = {
  toolbar: {
    background: "white",
    color: "rgba(0, 0, 0, .87);",
    boxShadow: 3,
  },
  iconLabelContainer: {
    display: "flex",
    alignItems: "center",
    gap: 3,
  },
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  labelContainer: {
    display: "flex",
    alignItems: "center",
    marginLeft: 2,
    color: "rgba(0, 0, 0, .87);",
  },
  icon: {
    verticalAlign: "middle",
    height: "18px",
  },
  statusLegendContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 2,
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
  },
  dropdownContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "30px",
  },
};

const ToolbarForMapping = ({
  labelText,
  showProperty,
  projectName,
  floors,
  selectedFloor,
  enteredFloor,
  onChangeInputHandler,
  onChangeDropdownHandler,
  onClickBackHandler,
}) => {
  return (
    <Box sx={styles.iconLabelContainer}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item sx={styles.iconContainer}>
          <Box onClick={onClickBackHandler}>
            <img src={backIcon} alt="Back" style={styles.icon} />
          </Box>
        </Grid>

        {!showProperty ? (
          <Grid item sx={styles.labelContainer}>
            <Typography
              variant="body1"
              component="span"
              sx={{ fontSize: "16px" }}
            >
              {labelText}
            </Typography>
          </Grid>
        ) : (
          <>
            <Grid item sx={{ marginLeft: 2 }}>
              <Typography
                variant="body2"
                component="span"
                sx={{ fontSize: "12px", color: "#848484" }}
              >
                Property
              </Typography>
              <br />
              <Typography
                variant="body1"
                component="span"
                sx={{ fontSize: "14px", color: "rgba(0, 0, 0, .87);" }}
              >
                {projectName}
              </Typography>
            </Grid>

            <Grid item size={4} sx={{ marginRight: 2, marginLeft: 4 }}>
              {" "}
              <AppInputField
                labelText="Search floor"
                showSearchIcon={true}
                value={enteredFloor}
                onChange={onChangeInputHandler}
                labelFont="14px"
                minWidth={200}
              />
            </Grid>
            {/* <Grid item size={2}>
              <AppDropdown
                labelName={"Floor"}
                options={floors}
                minWidth={200}
                value={selectedFloor}
                onChange={onChangeDropdownHandler}
              />
            </Grid> */}
          </>
        )}
      </Grid>
    </Box>
  );
};

const ToolbarForProperty = ({}) => {
  const {
    state: digitalTwinState,
    handleSelectedProjects,
    handleSelectedUnits,
    handleSelectedFacilities,
    handleOnClickStatus,
    handleTicketsOnSpace,
    handleSelectedTab
  } = useDigitalTwin();
  const {
    projects = [],
    units = [],
    facilities = [],
    selectedProjects,
    selectedUnits,
    selectedFacilities,
  } = digitalTwinState;

  const {
    state: spaceState,
    handleSelectedFloor,
    handleEnterSpaceId,
    handleFloors,
  } = useSpace();
  const { floors, selectedFloor } = spaceState;

  const onChangeFloorHandler = (e) => {
    const floor = e.target.value;
    console.log("floor", floor);
    handleSelectedFloor(floor);
    handleSelectedUnits(null);
    handleSelectedFacilities(null);
  };

  const onChangeProjectHandler = (event, newValue) => {
    handleEnterSpaceId(newValue?.spaceData?.spaceId);
    handleSelectedProjects(newValue);
    handleSelectedFacilities(null);
    handleSelectedUnits(null);
    // handleFloors(new Set());
    handleSelectedFloor(null);
    handleOnClickStatus("All");
    const floorOptions = Array.from(
      { length: newValue?.spaceData?.floors },
      (_, index) => index
    );
    handleFloors(floorOptions);
    handleSelectedTab("Overview")
  };

  const onChangeUnitHandler = (event, newValue) => {
    handleSelectedUnits(newValue);
    if (
      selectedFloor === null &&
      newValue?.smplrSpaceData?.index !== undefined
    ) {
      const floorData = floors.find(floor => floor.value === newValue.smplrSpaceData.index);
      handleSelectedFloor(floorData || { name: `Floor ${newValue.smplrSpaceData.index + 1}`, value: newValue.smplrSpaceData.index });
    }
    handleSelectedFacilities(null);
    handleOnClickStatus("All");
    handleTicketsOnSpace([]);
  };

  const onChangeFacilityHandler = (event, newValue) => {
    handleSelectedFacilities(newValue);
    if (
      selectedFloor === null &&
      newValue?.smplrSpaceData?.index !== undefined
    ) {
      const floorData = floors.find(floor => floor.value === newValue.smplrSpaceData.index);
      handleSelectedFloor(floorData || { name: `Floor ${newValue.smplrSpaceData.index + 1}`, value: newValue.smplrSpaceData.index });
    }
    handleSelectedUnits(null);
    handleOnClickStatus("All");
    handleTicketsOnSpace([]);
  };

  const onClearSelectedFloor = () => {
    handleSelectedFloor(null);
    handleSelectedUnits(null);
    handleSelectedFacilities(null);
  };

  const onClearSelectedUnit = () => {
    handleSelectedUnits(null);
  };

  const onClearSelectedFacility = () => {
    handleSelectedFacilities(null);
  };

  const filteredUnitFloorWise =
    selectedFloor != null && selectedFloor.value !== undefined
      ? units.filter((unit) => unit.smplrSpaceData.index === selectedFloor.value)
      : units;

  const filteredFacilityFloorWise =
    selectedFloor != null && selectedFloor.value !== undefined
      ? facilities.filter(
          (facility) => facility.smplrSpaceData.index === selectedFloor.value
        )
      : facilities;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container alignItems="center" spacing={4}>
        <Grid size={7}>
          <Box sx={styles.dropdownContainer}>
            <Box>
              <AppDropdown
                labelName={"Select Property"}
                options={projects}
                value={selectedProjects}
                onChange={onChangeProjectHandler}
                minWidth={300}
                searchable
                disabled
              />
            </Box>
            <Box>
              <AppDropdown
                labelName={"Floor Filter"}
                minWidth={140}
                options={floors}
                value={selectedFloor === null ? "" : selectedFloor}
                onChange={onChangeFloorHandler}
                onClearSelectedFloor={onClearSelectedFloor}
              />
            </Box>
            <Box>
              <AppDropdown
                labelName={"Unit Filter"}
                minWidth={300}
                options={filteredUnitFloorWise}
                value={selectedUnits}
                onChange={onChangeUnitHandler}
                searchable
                onClearSelectedUnit={onClearSelectedUnit}
              />
            </Box>
            <Box>
              <AppDropdown
                labelName={"Facility Filter"}
                minWidth={300}
                options={filteredFacilityFloorWise}
                value={selectedFacilities}
                onChange={onChangeFacilityHandler}
                searchable
                onClearSelectedFacility={onClearSelectedFacility}
              />
            </Box>
          </Box>
        </Grid>

        {/* <Grid size={4}>
          <StatusLegend />
        </Grid> */}

        {/* <Grid size={5}>
          <StatusLegend />
        </Grid> */}
      </Grid>
    </Box>
  );
};
const AppToolBar = ({
  mapped = true,
  labelText = "Map Property",
  showProperty = false,
  showModal = false,
  enteredFloor,
  selectedFloor,
  onChangeInputHandler,
  onChangeDropdownHandler,
  onClickBackHandler,
}) => {
  const { state } = useSpace();
  const { projectName, floors } = state;

  return (
    <MuiToolbar sx={styles.toolbar}>
      {mapped ? (
        <ToolbarForMapping
          projectName={projectName}
          labelText={labelText}
          showProperty={showProperty}
          floors={floors}
          showModal={showModal}
          enteredFloor={enteredFloor}
          selectedFloor={selectedFloor}
          onChangeInputHandler={onChangeInputHandler}
          onChangeDropdownHandler={onChangeDropdownHandler}
          onClickBackHandler={onClickBackHandler}
        />
      ) : (
        <ToolbarForProperty />
      )}
    </MuiToolbar>
  );
};

export default AppToolBar;
