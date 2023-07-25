import { useEffect, useRef, useState } from "react";
import createMapView, {
  MapProperties,
  MapViewProperties,
} from "@/utils/createMapView";
import Basemap from "@arcgis/core/Basemap";
import { Esri } from "@/types";
import useBMMapWrapper from "@/hooks/useBMMapWrapper";
import useBMMap from "@/hooks/useBMMap";

export interface IBMMapViewProps {
  mapProps: MapProperties;
  mapViewProperties: MapViewProperties;
}

const BMMapView = ({ mapProps, mapViewProperties }: IBMMapViewProps) => {
  // const ref = useBMMapWrapper(
  //   { basemap: "streets" },
  //   { view: { center: [-118, 34], zoom: 8 } }
  // );

  const ref = useBMMap(
    { basemap: "topo-vector" },
    { center: [-118, 34], zoom: 8 }
  );

  // const [view, setView] = useState<Esri.MapView>();
  // const mapRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   setView(createMapView(mapRef.current!, mapProps, mapViewProperties));

  //   return () => view && view.destroy();
  // }, []);

  // useEffect(() => {
  //   if (!view) return;

  //   view.map.basemap =
  //     typeof mapProps.basemap === "string"
  //       ? Basemap.fromId(mapProps.basemap!)
  //       : new Basemap(mapProps.basemap!);
  // }, [view, mapProps]);

  return <div ref={ref} style={{ height: 800, width: 700 }} />;
};

export default BMMapView;
