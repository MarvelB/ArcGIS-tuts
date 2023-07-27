import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import config from "@arcgis/core/config";
import { setAssetPath } from "@esri/calcite-components/dist/components";

// Set the API key for ArcGIS API for the JavaScript API
config.apiKey = import.meta.env.VITE_API_KEY;
setAssetPath(location.href);
// setAssetPath(window.location.href);
// setAssetPath(import.meta.env.VITE_ARCGIS_ASSETS_PATH);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
