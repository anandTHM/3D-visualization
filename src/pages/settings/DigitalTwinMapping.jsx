import React, { useEffect, useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import { Box, Typography, Divider } from "@mui/material";
import AppButton from "../../components/AppButton";
import noSpace from "../../assets/noSpace.svg";
import AppInput from "../../components/AppInputField";
import { useSpace } from "../../store";
import { loadSmplrJs } from "@smplrspace/smplr-loader";
import { config } from "../../utils";
import edit from "../../assets/edit.svg";
import AppModal from "../../components/AppModal";
import { post, put } from "../../service";
import AppToolBar from "../../components/AppToolbar";
import AppLoader from "../../components/AppLoader";

const SpaceIdValidator = ({
  enterSpaceId,
  handleEnterSpaceId,
  getPropertyhandler,
  validSpace,
  invalidSpace,
  propertyName,
  handleValidSpace,
  projectName,
  openModal,
  isLoading,
}) => {
  return (
    <>
      <Box
        sx={{
          padding: 2,
          display: "flex",
          flexDirection: "column",
          height: "82%",
        }}
      >
        <Box sx={{ mb: 1 }}>
          <Typography variant="body1" sx={{ color: "#848484" }}>
            Property
          </Typography>
          <Typography variant="body1">{projectName}</Typography>
        </Box>

        {validSpace ? (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ color: "#848484" }}>
                Enter Space Id
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="body1">{enterSpaceId}</Typography>
                <img
                  src={edit}
                  alt="edit"
                  style={{ cursor: "pointer", width: 30, height: 30 }}
                  onClick={() => handleValidSpace(false)}
                />
              </Box>
              {isLoading ? (
                <Box sx={{ mt: 2 }}>
                  <AppLoader thickness={5} size={30} color="#000000" />
                </Box>
              ) : (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" sx={{ color: "#7E1946" }}>
                    {propertyName}
                  </Typography>
                </Box>
              )}
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ mt: 1 }}>
              <AppInput
                showSearchIcon={false}
                value={enterSpaceId}
                onChange={(e) => handleEnterSpaceId(e.target.value)}
                width="500px"
              />
            </Box>
            <Box sx={{ mt: 1 }}>
              {invalidSpace && (
                <Typography variant="body1" sx={{ color: "#DF4A4A", mb: 2 }}>
                  Unable to find the property for this Space ID
                </Typography>
              )}
            </Box>
            <Box sx={{ mt: 1 }}>
              <AppButton
                variant="contained"
                labelText={"Get Property"}
                onClick={getPropertyhandler}
                backgroundColor={"#F4F4F4"}
                color={"#444444"}
                disabled={!enterSpaceId}
              />
            </Box>
          </>
        )}
      </Box>
      <Divider sx={{ mt: 2 }} />
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <AppButton
          variant="contained"
          labelText={"Next"}
          disabled={isLoading || !validSpace}
          onClick={openModal}
          color="#FFFFFF"
          backgroundColor="#7E1946"
          disabledBackgroundColor="#B0B0B0"
          disabledColor="#FFFFFF"
        />
      </Box>
    </>
  );
};

const showNoSpaceImage = () => {
  const spaceContainer = document.getElementById("space");
  spaceContainer.innerHTML = `
    <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background-color: #f5f5f5;">
      <img
        src=${noSpace}
        alt="noSpace"
        style="max-width: 100%; max-height: 100%; object-fit: contain;"
      />
    </div>
  `;
};

const DigitalTwinMapping = () => {
  const spaceRef = useRef(null);
  const [isSmplrReady, setSmplrReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    state,
    handleFloors,
    handleViewerReady,
    handleEnterSpaceId,
    handleFloorWisePolygons,
    handleValidSpace,
    handleInvalidSpace,
    handlePropertyName,
    handleClose,
    handleOpen,
  } = useSpace();
  const {
    enterSpaceId,
    validSpace,
    invalidSpace,
    propertyName,
    projectName,
    projectId,
    authToken,
    floorWisePolygons,
  } = state;

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    showNoSpaceImage();
    loadSmplrJs("esm")
      .then(() => setSmplrReady(true))
      .catch((error) => {
        console.error("Error preloading Smplr.js:", error);
      });
  }, []);

  const fetchData = async (smplr) => {
    setIsLoading(true);

    const smplrClient = new smplr.QueryClient({
      organizationId: config.organizationId,
      clientToken: config.clientToken,
    });

    handleInvalidSpace(false);
    try {
      if (spaceRef.current) {
        await spaceRef.current.startViewer({
          preview: false,
          mode: "3d",
          onReady: () => {
            console.log("Space is ready");
            handleViewerReady(true);
          },
          onVisibleLevelsChanged: (floors) => {
            handleFloors(floors);
          },
          disableCameraControls: false,
          disableCameraRotation: false,
          hideNavigationButtons: false,
          hideLevelPicker: false,
          backgroundColor: "#ffffff",
        });
      }
      const space = await smplrClient.getSpace(enterSpaceId);
      const furnitures = await smplrClient.getAllFurnitureInSpace(enterSpaceId);

      const polygons = space?.assetmap.filter(
        (item) => item.type === "polygon"
      )[0];

      const floorWiseDataObj = {};

      polygons?.assets.forEach((asset) => {
        const floor = asset.levelIndex + 1;
        if (!floorWiseDataObj[floor]) {
          floorWiseDataObj[floor] = [];
        }
        floorWiseDataObj[floor].push({
          type: "polygon",
          objectId: asset.id,
          objectName: asset.name,
        });
      });

      // Add furniture data
      furnitures.forEach((furniture) => {
        const floor = furniture.levelIndex + 1;
        if (!floorWiseDataObj[floor]) {
          floorWiseDataObj[floor] = [];
        }
        floorWiseDataObj[floor].push({
          type: "furniture",
          objectId: furniture.id,
          objectName: furniture.name,
          catalogId: furniture.catalogId,
          position: furniture.position,
          rotation: furniture.rotation,
          dimensions: furniture.dimensions,
          configuration: furniture.configuration,
        });
      });

      const floorWiseData = Object.entries(floorWiseDataObj).map(
        ([floor, floorData]) => ({
          floor: parseInt(floor),
          floorData,
        })
      );

      setIsLoading(false);

      handleFloorWisePolygons(floorWiseData);
      handlePropertyName(space.name);
    } catch (error) {
      console.error("Error loading space:", error);
      handleValidSpace(false);
      handleInvalidSpace(true);
      showNoSpaceImage();
    }
  };

  const handleSpaceViewer = useCallback(() => {
    const spaceContainer = document.getElementById("space");
    if (spaceContainer) {
      spaceContainer.innerHTML = "";
      const div = document.createElement("div");
      div.id = "smplr-container";
      div.className = "smplr-embed";
      spaceContainer.appendChild(div);

      if (isSmplrReady) {
        loadSmplrJs("esm")
          .then((smplr) => {
            spaceRef.current = new smplr.Space({
              spaceId: enterSpaceId,
              clientToken: config.clientToken,
              containerId: "smplr-container",
              whiteLabel: config.whiteLabel,
            });
            handleValidSpace(true);
            fetchData(smplr);
          })
          .catch((error) => {
            console.error("Error loading smplr:", error);
            handleInvalidSpace(true);
            handleFloorWisePolygons([]);
            showNoSpaceImage();
          });
      } else {
        handleInvalidSpace(true);
        handleFloorWisePolygons([]);
        showNoSpaceImage();
      }
    }
  }, [enterSpaceId, fetchData, isSmplrReady]);

  // const onClickSpaceConfirmationHandler = async () => {
  //   const payload = {
  //     spaceData: {
  //       status: true,
  //       spaceId: enterSpaceId,
  //       floors: floorWisePolygons?.length,
  //     },
  //   };
  //   const totalFloorDataItems = floorWisePolygons.reduce(
  //     (sum, item) => sum + item.floorData.length,
  //     0
  //   );

  //   const polygonPayload = {
  //     spaceId: enterSpaceId,
  //     spaceName: propertyName,
  //     spaceType: "polygon",
  //     totalPolygons: totalFloorDataItems,
  //   };
  //   console.log("response", polygonPayload, authToken);

  //   const response = await post(
  //     `/digial-twin/${projectId}`,
  //     polygonPayload,
  //     authToken
  //   );
  //   console.log("response", response);

  //   setLoading(true);

  //   try {
  //     const response = await put(
  //       `/project/addSpaceId/${projectId}`,
  //       payload,
  //       authToken
  //     );

  //     if (response.status === 200) {
  //       setOpenModal(false);
  //       navigate("/floor-listings");
  //     } else {
  //       console.log("Failed to add space ID");
  //       // navigate("/floor-listings");
  //     }
  //   } catch (error) {
  //     console.log("Error response:", error.response);
  //     // navigate("/floor-listings");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onClickSpaceConfirmationHandler = async () => {
    setLoading(true);

    const payload = {
      spaceData: {
        status: true,
        spaceId: enterSpaceId,
        floors: floorWisePolygons?.length,
      },
    };

    const totalFloorDataItems = floorWisePolygons.reduce(
      (sum, item) => sum + item.floorData.length,
      0
    );

    const polygonPayload = {
      spaceId: enterSpaceId,
      spaceName: propertyName,
      spaceType: "polygon",
      totalPolygons: totalFloorDataItems,
    };

    const queryParams = new URLSearchParams({ projectId }).toString();

    try {
      const polygonResponse = await post(
        `/digital-twin?${queryParams}`,
        polygonPayload,
        authToken
      );

      if (polygonResponse.status !== 200) {
        console.log("Failed to post polygon data");
        return;
      }

      const spaceIdResponse = await put(
        `/project/${projectId}/add-space-id`,
        payload,
        authToken
      );

      if (spaceIdResponse.status === 200) {
        setOpenModal(false);
        navigate("/floor-listings");
      } else {
        console.log("Failed to add space ID");
      }
    } catch (error) {
      console.log("Error response:", error.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppToolBar onClickBackHandler={() => window.history.back()} />
      <Box sx={{ flexGrow: 1, background: "#ffffff" }}>
        <Grid container>
          <Grid size={5}>
            <SpaceIdValidator
              enterSpaceId={enterSpaceId}
              handleEnterSpaceId={handleEnterSpaceId}
              getPropertyhandler={handleSpaceViewer}
              validSpace={validSpace}
              invalidSpace={invalidSpace}
              propertyName={propertyName}
              handleValidSpace={handleValidSpace}
              projectName={projectName}
              openModal={() => setOpenModal(true)}
              isLoading={isLoading}
            />
          </Grid>
          <Grid size={7}>
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
              }}
            ></Box>
          </Grid>
        </Grid>
      </Box>
      <AppModal
        open={openModal}
        headerText="Confirmation"
        descriptionText={`Mappping MTL property  < ${projectName} >   to Digital Twin   < ${propertyName} >    \n Are you sure you want to proceed with mapping units ? \n\n Note that you will not be allowed to change the space ID after confirmation .`}
        primaryButtonText="Confirm"
        secondaryButtonText="Cancel"
        onClickPrimaryButton={onClickSpaceConfirmationHandler}
        isLoading={loading}
        onClickCancelHandler={() => setOpenModal(false)}
      />
    </>
  );
};

export default DigitalTwinMapping;
