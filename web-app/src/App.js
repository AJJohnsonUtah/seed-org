import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ThemeProvider, createTheme } from "@mui/material";
import SeedList from "./SeedInventory/SeedList";

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

function App() {
  return (
    <div className="App" style={{backgroundColor: '#CEEEFE'}}>
      <ThemeProvider theme={theme}>
        <SeedList />
      </ThemeProvider>
    </div>
  );
}

export default App;
