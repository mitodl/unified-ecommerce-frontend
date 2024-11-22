"use client";

import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import styled from "@emotion/styled";
import Typography from "@mui/material/Typography";

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  padding: "16px 8px",
  backgroundColor: theme.custom.colors.navGray,
  boxShadow: "none",
  ".MuiToolbar-root": {
    minHeight: "auto",
    height: "100%",
  },
  height: theme.custom.dimensions.headerHeight,
  [theme.breakpoints.down("sm")]: {
    height: theme.custom.dimensions.headerHeightSm,
    padding: "0",
  },
}));

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h3">Shopping Cart</Typography>
      </Toolbar>
    </AppBar>
  );
};

export { Header };
