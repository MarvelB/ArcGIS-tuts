import { Esri } from "@/types";
import { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Basemap from "@arcgis/core/Basemap";

const useBMMap = (
  mapProps: Esri.MapProperties,
  mapViewProps?: Omit<Esri.MapViewProperties, "map" | "container">
): React.MutableRefObject<null> | null => {
  const mapRef = useRef(null);

  const [mapView, setMapView] = useState<MapView>();

  useEffect(() => {
    const map = new Map(mapProps);

    const view = new MapView({
      ...mapViewProps,
      map,
      container: mapRef.current ?? undefined,
    });

    setMapView(view);

    return () => mapView?.destroy();
  }, []);

  useEffect(() => {
    if (!mapView || !mapProps || !mapProps.basemap) return;

    mapView.map.basemap =
      typeof mapProps.basemap === "string"
        ? Basemap.fromId(mapProps.basemap!)
        : new Basemap(mapProps.basemap!);
  }, [mapView, mapProps]);

  return mapRef;
};

export default useBMMap;
