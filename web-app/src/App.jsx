import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ThemeProvider, createTheme } from "@mui/material";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import FloralMixCalendarDisplay from "./FloralMixCalendar/FloralMixCalendarDisplay";
import LoginPage from "./Login/LoginPage";
import DragDropPlantingContextProvider from "./PlantLayout/DragDropPlantingContext";
import Plantings from "./PlantLayout/Plantings";
import SeedList from "./SeedInventory/SeedList";
import TaskDashboard from "./TaskDashboard/TaskDashboard";
import UserHome from "./UserHome";
import AuthContextProvider from "./common/context/AuthContext";
import PlantingDialogContextProvider from "./common/context/PlantingDialogContext";
import { setupAxiosDefaults } from "./config/AxiosConfig";
import Orders from "./orders/Orders";

setupAxiosDefaults();

const theme = createTheme({
  palette: {
    primary: {
      main: "#2196f3", // Blue color for primary
    },
    secondary: {
      main: "#4caf50", // Green color for secondary
    },
    // You can add more colors or customize other palette options as needed
  },
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
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/verify-email/:verificationCode/:userId",
        element: <VerifyEmailPage />,
      },
      {
        path: "/",
        element: <TaskDashboard />,
      },
      {
        path: "/dashboard",
        element: <TaskDashboard />,
      },
      {
        path: "/inventory",
        element: <SeedList />,
      },
      {
        path: "/schedule",
        element: <FloralMixCalendarDisplay />,
      },
      {
        path: "/plantings",
        element: (
          <DragDropPlantingContextProvider>
            <Plantings />
          </DragDropPlantingContextProvider>
        ),
      },
      {
        path: "/orders",
        element: <Orders />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="App" style={{ backgroundColor: "#CEEEFE", height: "100%" }}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
}

export default App;
