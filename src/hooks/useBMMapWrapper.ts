import { Esri } from "@/types";
import { useMap } from "esri-loader-hooks";
import { ILoadViewOptions } from "esri-loader-hooks/dist/utils/arcgis";

const useBMMapWrapper = (
  map: Esri.MapProperties,
  options?: ILoadViewOptions
) => {
  const [ref] = useMap(map, options);

  return ref;
};

export default useBMMapWrapper;
