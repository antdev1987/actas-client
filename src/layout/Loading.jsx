import React from "react";

import LoadingOverlay from "react-loading-overlay";
import { useAppProvider } from "../context/actasContext/AppProvider";
import { useAuth } from "../context/userContext/UserProvider";
LoadingOverlay.propTypes = undefined;

const Loading = ({ children }) => {
  const { isActiveLoading } = useAppProvider();
  const {isUserActiveLoading} = useAuth()

  return (
    <LoadingOverlay
      active={isActiveLoading || isUserActiveLoading ||false}
      // spinner={<BounceLoader />}
      className="min-vh-100 adelante"
      spinner
      text="Loading your content..."
    >
      {children}
    </LoadingOverlay>
  );
};

export default Loading;
