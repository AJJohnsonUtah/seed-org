import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ThemeProvider, createTheme } from "@mui/material";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import FloralMixCalendarDisplay from "./FloralMixCalendar/FloralMixCalendarDisplay";
import DragDropPlantingContextProvider from "./PlantLayout/DragDropPlantingContext";
import FlowerBoyLayout from "./PlantLayout/FlowerBoyLayout";
import SeedList from "./SeedInventory/SeedList";
import UserHome from "./UserHome";
import AuthContextProvider from "./common/context/AuthContext";
import PlantingDialogContextProvider from "./common/context/PlantingDialogContext";
import Orders from './orders/Orders';

const theme = createTheme({
  typography: {
    h1: {
      fontSize: 36,
    },
    h6: {
      fontSize: 18,
      fontWeight: 500,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthContextProvider>
        <PlantingDialogContextProvider>
          <UserHome />
        </PlantingDialogContextProvider>
      </AuthContextProvider>
    ),
    children: [
      {
        path: "/inventory",
        element: <SeedList />,
      },
      {
        path: "/schedule",
        element: <FloralMixCalendarDisplay />,
      },
      {
        path: "/layout",
        element: (
          <DragDropPlantingContextProvider>
            <FlowerBoyLayout />
          </DragDropPlantingContextProvider>
        ),
      },
      {
        path: "/orders",
        element: (
            <Orders />
        ),
      },
    ],
  },
]);

function App() {
  return (
    <div className="App" style={{ backgroundColor: "#CEEEFE" }}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
}

export default App;
