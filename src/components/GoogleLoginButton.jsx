import React, { useEffect, useState } from "react";

const GoogleLoginButton = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    /* Inisialisasi Google Identity Services */
    window.google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID", // Ganti dengan Client ID Anda
      callback: handleCredentialResponse,
    });

    /* Render Tombol Google Login */
    window.google.accounts.id.renderButton(
      document.getElementById("google-login-button"),
      {
        theme: "outline",
        size: "large",
      }
    );
  }, []);

  const handleCredentialResponse = (response) => {
    // Mendapatkan token JWT
    const credential = response.credential;

    // Decode payload JWT untuk mendapatkan informasi user
    const user = JSON.parse(atob(credential.split(".")[1]));
    setUser(user);
  };

  return <div id="google-login-button"></div>;
};

export default GoogleLoginButton;
