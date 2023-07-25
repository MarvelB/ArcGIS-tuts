import { Esri } from "@/types";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";

export type MapProperties = Esri.MapProperties;

export type MapViewProperties = Omit<
  Esri.MapViewProperties,
  "map" | "container"
>;

const createMapView = (
  mapRef: HTMLDivElement,
  mapProperties: MapProperties,
  mapViewProperties: MapViewProperties
) => {
  const map = new Map({
    ...mapProperties,
  });

  const view = new MapView({
    ...mapViewProperties,
    map,
    container: mapRef,
  });

  return view;
};

export default createMapView;
