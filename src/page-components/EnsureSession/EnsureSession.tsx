"use client";

import { useUsersMe } from "@/services/ecommerce/users/hooks";
import { useEffect } from "react";
import MuiBackdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mitodl/smoot-design";
import { getCurrentSystem } from "@/utils/system";

const Backdrop = styled(MuiBackdrop)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  color: theme.custom.colors.white,
}));

const establishSession = () => {
  window.location.assign(
    `${process.env.NEXT_PUBLIC_UE_API_BASE_URL}/establish_session/?next=${getCurrentSystem()}`,
  );
};

const EnsureSession = () => {
  const meQuery = useUsersMe();

  const isAuthenticated = !!meQuery.data?.id;
  const shouldAuthenticate = !meQuery.isLoading && !isAuthenticated;

  useEffect(() => {
    if (shouldAuthenticate) {
      establishSession();
    }
  }, [shouldAuthenticate]);

  return isAuthenticated ? (
    <>
      <p>
        Force reauth:{" "}
        <button onClick={() => establishSession()} type="button">
          Do It!
        </button>{" "}
      </p>
    </>
  ) : (
    <Backdrop open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default EnsureSession;
