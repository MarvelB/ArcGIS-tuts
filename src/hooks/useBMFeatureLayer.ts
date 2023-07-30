import { Esri } from "@/types";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { useEffect, useState } from "react";

const useBMFeatureLayer = (
  feautureLayerProps: Esri.FeatureLayerProperties,
  skip?: boolean
) => {
  const [featureLayer, setFeatureLayer] = useState<FeatureLayer>();

  useEffect(() => {
    if (skip) return;

    const layer = new FeatureLayer({
      ...feautureLayerProps,
    });

    setFeatureLayer(layer);
  }, [skip]);

  return featureLayer;
};

export default useBMFeatureLayer;
