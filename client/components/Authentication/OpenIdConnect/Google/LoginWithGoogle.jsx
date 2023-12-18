import { useEffect, useState } from "react";

const LoginWithGoogle = ({ applicationConfig }) => {
  const [authorizationUrl, setAuthorizationUrl] = useState();

  const { client_id, config_url } = applicationConfig.open_id_google;

  const loadAuthorizationUrl = async () => {
    console.log("TRIGGERED");

    const res = await fetch(config_url);
    const discoveryDocument = await res.json();
    const params = {
      response_type: "token",
      scope: "email profile",
      client_id,
      redirect_uri: window.location.origin + "/login/callback",
    };
    setAuthorizationUrl(
      discoveryDocument.authorization_endpoint +
        "?" +
        new URLSearchParams(params),
    );
  };

  useEffect(() => {
    loadAuthorizationUrl();
  }, []);

  return <a href={authorizationUrl}>Login With Google</a>;
};

export default LoginWithGoogle;
