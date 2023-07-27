import { Esri } from "@/types";
import { useWebMap } from "esri-loader-hooks";
import { ILoadViewOptions } from "esri-loader-hooks/dist/utils/arcgis";

const useBMWebMapWrapper = (
  map: Esri.WebMapProperties,
  options?: ILoadViewOptions
) => {
  const [ref] = useWebMap(map, options);

  return ref;
};

export default useBMWebMapWrapper;
