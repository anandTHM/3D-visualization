import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { SpaceProvider } from "./store/index.jsx";
import { DigitalTwinProvider } from "./store/digitalTwin.jsx";
import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SpaceProvider>
      <DigitalTwinProvider>
        <App />
      </DigitalTwinProvider>
    </SpaceProvider>
  </StrictMode>
);
