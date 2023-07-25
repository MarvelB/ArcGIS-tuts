import { Esri } from "@/types";

export const destroyView = (view: Esri.MapView) => {
  if (!view) return;

  view = view.container = null;
};
