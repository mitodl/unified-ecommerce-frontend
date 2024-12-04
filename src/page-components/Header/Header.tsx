"use client";

import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import styled from "@emotion/styled";
import Typography from "@mui/material/Typography";
import { useUsersMe } from "@/services/ecommerce/users/hooks";
import Image from "next/image";
import MitLogo from "@/public/images/mit-logo-white.svg";

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  padding: "16px 8px",
  backgroundColor: theme.custom.colors.navGray,
  boxShadow: "none",
  height: theme.custom.dimensions.headerHeight,
  ".MuiToolbar-root": {
    minHeight: "auto",
    height: "100%",
  },
  [theme.breakpoints.down("sm")]: {
    height: theme.custom.dimensions.headerHeightSm,
    padding: "0",
  },
}));

const Username = styled.span(({ theme }) => ({
  color: theme.custom.colors.lightGray2,
  margin: "0 16px",
  ...theme.typography.body2,
}));

const Header = () => {
  const meQuery = useUsersMe();
  const displayName = meQuery.data?.email;
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography flex={1} variant="h3">
          Shopping Cart
        </Typography>
        {displayName ? <Username>{displayName}</Username> : null}
        <Image height={32} src={MitLogo} alt="" />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
