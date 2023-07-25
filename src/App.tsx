import BMMapView from "@/components/BMMapView";

const App = () => {
  return (
    <BMMapView
      mapProps={{ basemap: "arcgis-topographic" }}
      mapViewProperties={{ center: [-118, 34], zoom: 8 }}
    />
  );
};

export default App;
