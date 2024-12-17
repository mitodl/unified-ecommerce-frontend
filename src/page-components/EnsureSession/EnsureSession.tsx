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

const ForceReauthContainer = styled.div`
  padding: 10px;
  width: 100%;
  border-bottom: 1px solid #333;
  background-color: rgba(0, 0, 0, 0.1);
`;

const establishSession = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const assignUrl = `${process.env.NEXT_PUBLIC_UE_API_BASE_URL}/establish_session/?next=${getCurrentSystem(urlParams)}`;
  window.location.assign(assignUrl);
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
    <ForceReauthContainer>
      <p>
        Force reauth:{" "}
        <button onClick={() => establishSession()} type="button">
          Do It!
        </button>{" "}
      </p>
    </ForceReauthContainer>
  ) : (
    <Backdrop open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default EnsureSession;
