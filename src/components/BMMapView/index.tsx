import useBMWebMap from "@/hooks/useBMWebMap";
import { MapInfoModel } from "@/types";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";
import Bookmarks from "@arcgis/core/widgets/Bookmarks";
import LayerList from "@arcgis/core/widgets/LayerList";
import Legend from "@arcgis/core/widgets/Legend";
import Print from "@arcgis/core/widgets/Print";
import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import "@esri/calcite-components/dist/components/calcite-action";
import "@esri/calcite-components/dist/components/calcite-action-bar";
import "@esri/calcite-components/dist/components/calcite-label";
import "@esri/calcite-components/dist/components/calcite-panel";
import "@esri/calcite-components/dist/components/calcite-rating";
import "@esri/calcite-components/dist/components/calcite-shell";
import "@esri/calcite-components/dist/components/calcite-shell-panel";
import {
  CalciteAction,
  CalciteActionBar,
  CalciteLabel,
  CalciteLoader,
  CalcitePanel,
  CalciteRating,
  CalciteShell,
  CalciteShellPanel,
  CalciteSwitch,
} from "@esri/calcite-components-react";

export interface BMMapViewWidgetProps {
  baseMapGallery: boolean;
  bookmarks: boolean;
  layerList: boolean;
  legend: boolean;
  print: boolean;
  mapDescription: boolean;
}

const initialWidgetVisibility: BMMapViewWidgetProps = {
  baseMapGallery: false,
  bookmarks: false,
  layerList: false,
  legend: false,
  print: false,
  mapDescription: false,
};

const BMMapView = () => {
  const [isLightMode, setIsLightMode] = useState<boolean>(true);

  const [ref, webMap, webMapView] = useBMWebMap(
    {
      portalItem: { id: "210c5b77056846808c7a5ce93920be81" },
      basemap: isLightMode ? "gray-vector" : "dark-gray-vector",
    },
    { padding: { top: 49 } }
  );

  const basemaGalleryRef = useRef<HTMLDivElement>(null);
  const bookmarksRef = useRef<HTMLDivElement>(null);
  const layerListRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const currentThemeClass = `calcite-mode-${isLightMode ? "light" : "dark"}`;

  const [mapDescription, setMapDescription] = useState<MapInfoModel>({
    headerTitle: "",
    mapDescription: "",
    thumbnailUrl: "",
    avgRating: 0,
  });

  const loading = useRef<boolean>(true);

  const [widgetsVisibility, setWidgetsVisibility] =
    useState<BMMapViewWidgetProps>(initialWidgetVisibility);

  const toggleWidgetVisibility = (
    e: React.MouseEvent<HTMLCalciteActionElement>,
    widget: keyof BMMapViewWidgetProps
  ) => {
    e.preventDefault();

    setWidgetsVisibility((prevState) => ({
      ...initialWidgetVisibility,
      [widget]: !prevState[widget],
    }));
  };

  const toggleTheme = (e: React.MouseEvent<HTMLCalciteLabelElement>) => {
    e.preventDefault();

    setIsLightMode(!isLightMode);
  };

  useEffect(() => {
    const head = document.head;
    const link = document.createElement("link");

    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = `./assets/themes/${isLightMode ? "light" : "dark"}/main.css`;

    head.appendChild(link);

    return () => {
      head.removeChild(link);
    };
  }, [isLightMode]);

  useEffect(() => {
    if (!webMapView || webMapView === null || !webMap || webMap === null)
      return;

    webMapView.ui.move("zoom", "bottom-right");

    const baseMap = new BasemapGallery({
      view: webMapView,
      container: basemaGalleryRef.current!,
    });

    const bookMarks = new Bookmarks({
      view: webMapView,
      container: bookmarksRef.current!,
    });
    const layerList = new LayerList({
      view: webMapView,
      container: layerListRef.current!,
    });
    const legend = new Legend({
      view: webMapView,
      container: legendRef.current!,
    });

    const print = new Print({ view: webMapView, container: printRef.current! });

    webMapView.when(() => {
      const { title, description, thumbnailUrl, avgRating } = webMap.portalItem;

      loading.current = false;

      setMapDescription({
        headerTitle: title,
        mapDescription: description,
        thumbnailUrl,
        avgRating,
      });
    });

    // return () => webMapView.when;
  }, [webMapView, webMap]);

  return (
    <Box
      height="inherit"
      width="100%"
      paddingX="auto"
      className={currentThemeClass}
    >
      {loading.current && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="inherit"
        >
          <CalciteLoader label="" />
        </Box>
      )}

      <CalciteShell
        contentBehind
        style={{ visibility: loading.current ? "hidden" : "visible" }}
      >
        <Box
          slot="header"
          id="header"
          display="flex"
          padding="0 1rem"
          sx={{ backgroundColor: "var(--calcite-ui-foreground-1)" }}
        >
          <h2 slot="header-title">{mapDescription.headerTitle}</h2>

          <Box
            slot="header-controls"
            id="header-controls"
            display="flex"
            alignSelf="auto"
            sx={{ marginInlineStart: "auto" }}
          >
            <CalciteLabel
              layout="inline"
              style={{ "--calcite-label-margin-bottom": 0, cursor: "pointer" }}
              onClick={toggleTheme}
            >
              Dark mode: Off
              <CalciteSwitch style={{ margin: "0 0.5rem" }}></CalciteSwitch>
              On
            </CalciteLabel>
          </Box>
        </Box>

        <CalciteShellPanel slot="panel-start" displayMode="float">
          <CalciteActionBar slot="action-bar">
            <CalciteAction
              text="Layers"
              icon="layers"
              onClick={(e) => toggleWidgetVisibility(e, "layerList")}
            />

            <CalciteAction
              text="Basemaps"
              icon="basemap"
              onClick={(e) => toggleWidgetVisibility(e, "baseMapGallery")}
            />

            <CalciteAction
              text="Legend"
              icon="legend"
              onClick={(e) => toggleWidgetVisibility(e, "legend")}
            />

            <CalciteAction
              text="Bookmarks"
              icon="bookmark"
              onClick={(e) => toggleWidgetVisibility(e, "bookmarks")}
            />

            <CalciteAction
              text="Print"
              icon="print"
              onClick={(e) => toggleWidgetVisibility(e, "print")}
            />

            <CalciteAction
              text="Information"
              icon="information"
              onClick={(e) => toggleWidgetVisibility(e, "mapDescription")}
            />
          </CalciteActionBar>

          <CalcitePanel heading="Layers" hidden={!widgetsVisibility.layerList}>
            <Box
              id="layers-container"
              ref={layerListRef}
              className="calcite-mode-dark"
            />
          </CalcitePanel>

          <CalcitePanel
            heading="Basemaps"
            hidden={!widgetsVisibility.baseMapGallery}
          >
            <Box ref={basemaGalleryRef} />
          </CalcitePanel>

          <CalcitePanel heading="Legend" hidden={!widgetsVisibility.legend}>
            <Box ref={legendRef} />
          </CalcitePanel>

          <CalcitePanel
            heading="Bookmarks"
            hidden={!widgetsVisibility.bookmarks}
          >
            <Box ref={bookmarksRef} />
          </CalcitePanel>

          <CalcitePanel heading="Print" hidden={!widgetsVisibility.print}>
            <Box ref={printRef} />
          </CalcitePanel>

          <CalcitePanel
            heading="Details"
            hidden={!widgetsVisibility.mapDescription}
          >
            <Box id="info-content" p="0.75rem">
              <img
                id="item-thumbnail"
                alt="webmap thumbnail"
                src={mapDescription.thumbnailUrl}
              />

              <Box
                id="item-description"
                dangerouslySetInnerHTML={{
                  __html: mapDescription.mapDescription,
                }}
              />

              <CalciteLabel layout="inline">
                <b>Rating:</b>

                <CalciteRating
                  id="item-rating"
                  value={mapDescription.avgRating}
                  readOnly
                />
              </CalciteLabel>
            </Box>
          </CalcitePanel>
        </CalciteShellPanel>

        <Box ref={ref} height="100%" className="calcite-mode-light" />
      </CalciteShell>
    </Box>
  );
};

export default BMMapView;
