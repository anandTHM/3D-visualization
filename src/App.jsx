import React, { useEffect } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import FloorListings from "./pages/settings/FloorListings";
import FloorMappedListings from "./pages/settings/FloorMappedListings";
import DigitalTwin from "./pages/analytics/DigitalTwin";
import DigitalTwinMapping from "./pages/settings/DigitalTwinMapping";
import { useSpace } from "./store";
import { useDigitalTwin } from "./store/digitalTwin";
import { get } from "./service";

const App = () => {
  const {
    handleAuthToken,
    handleLang,
    handleProject,
    handleProjectName,
    handleEnterSpaceId,
    handleFloors,
  } = useSpace();

  const { handleOrganizationTimeZone, handleOrganizationCurrency , handleClientToken , handleOrganizationId } =
    useDigitalTwin();

  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("auth");
  const lang = searchParams.get("lang");
  const projectId = searchParams.get("project");
  const projectName = searchParams.get("projectName");
  const spaceId = searchParams.get("spaceId");
  const floors = searchParams.get("floors");

  useEffect(() => {
    if (token) {
      handleAuthToken(token);
    }
    if (lang) {
      handleLang(lang);
    }

    if (projectId) {
      handleProject(projectId);
    }

    if (projectName) {
      handleProjectName(projectName);
    }

    if (spaceId) {
      handleEnterSpaceId(spaceId);
    }

    fetchData(token);
  }, []);

  const fetchData = async (token) => {
    try {
      const response = await get("user/refresh-payload", {}, token);
      const { currencyCode, organizationTimezone , smplrSpaceClientToken , smplrSpaceOrganizationId} = response.data;
      handleOrganizationCurrency(currencyCode);
      handleOrganizationTimeZone(organizationTimezone);
      handleOrganizationId(smplrSpaceOrganizationId);
      handleClientToken(smplrSpaceClientToken)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/digital-twin-mapping" replace />}
        />
        <Route path="/digital-twin-mapping" element={<DigitalTwinMapping />} />
        <Route path="/digital-twin" element={<DigitalTwin  />} />
        <Route path="/floor-listings" element={<FloorListings />} />
        <Route path="/floor-mapping-units" element={<FloorMappedListings />} />
      </Routes>
    </Router>
  );
};

export default App;
