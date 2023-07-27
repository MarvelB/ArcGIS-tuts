import { Esri } from "@/types";
import { useEffect, useRef, useState } from "react";
import WebMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";
import Basemap from "@arcgis/core/Basemap";

const useBMWebMap = (
  mapProps: Esri.WebMapProperties,
  mapViewProps?: Omit<Esri.MapViewProperties, "map" | "container">
): [
  React.MutableRefObject<null> | null,
  WebMap | undefined,
  MapView | undefined
] => {
  const mapRef = useRef(null);

  const [webMapView, setWebMapView] = useState<MapView>();

  const [webMap, setWebMap] = useState<WebMap>();

  useEffect(() => {
    const map = new WebMap(mapProps);

    setWebMap(map);

    const view = new MapView({
      ...mapViewProps,
      map,
      container: mapRef.current ?? undefined,
    });

    setWebMapView(view);

    return () => webMapView?.destroy();
  }, []);

  useEffect(() => {
    if (!webMapView || !mapProps?.basemap) return;

    webMapView.map.basemap =
      typeof mapProps.basemap === "string"
        ? Basemap.fromId(mapProps.basemap!)
        : new Basemap(mapProps.basemap!);
  }, [webMapView, mapProps.basemap]);

  return [mapRef, webMap, webMapView];
};

export default useBMWebMap;
