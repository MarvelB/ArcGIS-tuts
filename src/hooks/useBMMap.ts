import { Esri } from "@/types";
import { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Basemap from "@arcgis/core/Basemap";

const useBMMap = (
  mapProps: Esri.MapProperties,
  mapViewProps?: Omit<Esri.MapViewProperties, "map" | "container">,
  skip?: boolean
): [
  React.MutableRefObject<null> | null,
  Esri.Map | undefined,
  Esri.MapView | undefined
] => {
  const mapRef = useRef(null);

  const [mapView, setMapView] = useState<MapView>();

  const [map, setMap] = useState<Map>();

  useEffect(() => {
    if (skip) return;

    const map = new Map(mapProps);

    setMap(map);

    const view = new MapView({
      ...mapViewProps,
      map,
      container: mapRef.current ?? undefined,
    });

    setMapView(view);

    return () => mapView?.destroy();
  }, [skip]);

  useEffect(() => {
    if (!mapView || !mapProps?.basemap) return;

    mapView.map.basemap =
      typeof mapProps.basemap === "string"
        ? Basemap.fromId(mapProps.basemap!)
        : new Basemap(mapProps.basemap!);
  }, [mapView, mapProps.basemap]);

  return [mapRef, map, mapView];
};

export default useBMMap;
