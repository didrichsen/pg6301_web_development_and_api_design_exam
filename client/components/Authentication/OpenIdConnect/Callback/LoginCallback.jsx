import { useEffect, useState } from "react";

const LoginCallback = ({ applicationConfig, onLogin }) => {
  async function handleCallback() {
    const { client_id, config_url } = applicationConfig.open_id_microsoft;

    const hashObject = Object.fromEntries(
      new URLSearchParams(window.location.hash.substring(1)),
    );

    let { access_token, code } = hashObject;

    console.log(hashObject);

    if (code) {
      const token_endpoint_JSON = await fetch(config_url);

      const { token_endpoint } = await token_endpoint_JSON.json();

      const code_verifier = window.sessionStorage.getItem("code_verifier");

      const response = await fetch(token_endpoint, {
        method: "POST",
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          client_id,
          code_verifier,
          redirect_uri: window.location.origin + "/login/callback",
        }),
      });

      const json = await response.json();

      access_token = json.access_token;
    }

    if (access_token) {
      const response = await fetch("/api/auth/login/access_token", {
        method: "POST",
        body: JSON.stringify({ access_token }),
        headers: {
          "content-type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          "Somehting went wrong when signing up with google",
          response.statusText,
        );
      }
    }

    await onLogin();
  }

  useEffect(() => {
    handleCallback();
  }, []);

  return (
    <>
      <div>Loading...</div>
    </>
  );
};

export default LoginCallback;
