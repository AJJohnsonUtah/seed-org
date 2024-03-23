import {
  CalendarMonth,
  Dashboard,
  Inventory,
  Logout,
  MonetizationOn,
  Person,
  Yard
} from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import { Container, Menu, MenuItem } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import * as React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuthContext } from "./common/context/AuthContext";
import PlantingDialogContextProvider from "./common/context/PlantingDialogContext";

const drawerWidth = 240;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

export function ProfileMenu({ drawerOpen }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { currentUser, logOut } = useAuthContext();

  function handleClick(e) {
    setAnchorEl(e.currentTarget);
  }

  function onClose() {
    setAnchorEl(null);
  }

  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: drawerOpen ? "initial" : "center",
          px: 2.5,
        }}
        onClick={handleClick}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: drawerOpen ? 3 : "auto",
            justifyContent: "center",
          }}
        >
          {<Person />}
        </ListItemIcon>
        <ListItemText primary={"Profile"} sx={{ opacity: drawerOpen ? 1 : 0 }} />
      </ListItemButton>
      <Menu
        id="profile-menu"
        MenuListProps={{
          "aria-labelledby": "profile-menu-btn-",
        }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
      >
        <MenuItem disabled>{currentUser.displayName}</MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            logOut();
          }}
        >
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText>Sign Out</ListItemText>
        </MenuItem>
      </Menu>
    </ListItem>
  );
}

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function UserHome() {
  const { currentUser } = useAuthContext();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  if (currentUser && !currentUser?.accountVerification?.verified) {
    return (
      <Container>
        <Typography variant="h5">
          Hey {currentUser.displayName}. It looks like your email hasn't been verified - check your email (
          {currentUser.email}) for the verification link to get started!
        </Typography>
      </Container>
    );
  }

  return (
    <PlantingDialogContextProvider>
      <Box sx={{ display: "flex", height: "100%" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {currentUser.primaryOrganization?.name}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open} style={{ height: "100%" }}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {[
              { linkTo: "/dashboard", displayText: "Task Dashboard", icon: <Dashboard /> },
              { linkTo: "/inventory", displayText: "Seed Inventory", icon: <Inventory /> },
              { linkTo: "/schedule", displayText: "Planting Calendar", icon: <CalendarMonth /> },
              { linkTo: "/plantings", displayText: "Plantings", icon: <Yard /> },
              { linkTo: "/orders", displayText: "Orders", icon: <MonetizationOn /> },
            ].map((navItem) => (
              <ListItem key={navItem.displayText} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  LinkComponent={Link}
                  to={navItem.linkTo}
                  aria-label={navItem.displayText}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {navItem.icon}
                  </ListItemIcon>
                  <ListItemText primary={navItem.displayText} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ flexGrow: 1 }} />
          <List>
            <ProfileMenu drawerOpen={open} />
            {/* <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
                LinkComponent={Link}
                to={"/settings"}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {<Settings />}
                </ListItemIcon>
                <ListItemText primary={"Settings"} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem> */}
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: "auto" }}>
          <DrawerHeader />
          <Outlet />
        </Box>
      </Box>
    </PlantingDialogContextProvider>
  );
}
