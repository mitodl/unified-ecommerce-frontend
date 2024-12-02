"use client";

import { useUsersMe } from "@/services/ecommerce/users/hooks";
import { useEffect } from "react";
import MuiBackdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mitodl/smoot-design";

const Backdrop = styled(MuiBackdrop)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  color: theme.custom.colors.white,
}));

/**
 * Store whether or not we've attempted to redirect the user to login in
 * session storage. That way, if something goes long, we (1) can throw an error
 * and (2) avoid an infinite loop.
 */
const REDIRECT_KEY = "login_redirected";
const establishSession = () => {
  if (sessionStorage.getItem(REDIRECT_KEY)) {
    throw new Error("Unable to establish session");
  }
  const encoded = encodeURIComponent(window.location.href);
  window.location.assign(
    `${process.env.NEXT_PUBLIC_UE_API_BASE_URL}/establish_session/?next=${encoded}`
  );
  sessionStorage.setItem(REDIRECT_KEY, "true");
  return () => sessionStorage.removeItem(REDIRECT_KEY);
};

const EnsureSession = () => {
  const meQuery = useUsersMe();

  const isAuthenticated = !!meQuery.data?.id;
  const shouldAuthenticate = !meQuery.isLoading && !isAuthenticated;

  useEffect(() => {
    if (shouldAuthenticate) {
      return establishSession();
    }
  }, [shouldAuthenticate]);

  return isAuthenticated ? null : (
    <Backdrop open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default EnsureSession;
