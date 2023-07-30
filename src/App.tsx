import BMMapView from "@/components/BMMapView";
import { Box } from "@mui/material";
import BMInteractiveMap from "./components/BMInteractiveMap";

const App = () => {
  return (
    <Box className="app">
      {/* <BMMapView /> */}

      <BMInteractiveMap />
    </Box>
  );
};

export default App;
