import React, { useEffect, useState } from "react";
import { clientId } from "../scripts/google_client_id";
import axios from "axios";

const GoogleLoginButton = (props) => {
  const { authGoogle,formData } = props
  if (!formData) return

  useEffect(() => {
    /* Inisialisasi Google Identity Services */
    window.google.accounts.id.initialize({
      client_id: clientId, // Ganti dengan Client ID Anda
      callback: handleCredentialResponse,
    });

    /* Render Tombol Google Login */
    window.google.accounts.id.renderButton(
      document.getElementById("google-login-button"),
      {
        theme: "filled_blue",
        size: "large",
        text:"continue_with"
      }
    );
  }, []);

  const handleCredentialResponse = async(response) => {
    // Mendapatkan token JWT
    const credential = response.credential;

    // Decode payload JWT untuk mendapatkan informasi user
    const user = JSON.parse(atob(credential.split(".")[1]));
    const { name,email,picture } = user||{}
    const res = await axios({
      url:picture,
      method:'get',
      responseType:'blob'
    })

    const photo = res.data

    formData.append("name",name)
    formData.append("email",email)
    formData.append("password",name.replaceAll(/\s+/g,'').toLowerCase())
    formData.append("photo",photo,`${name.replaceAll(/\s+/g,'')}.png`)

    // setData({...data,name,email,password:name.replaceAll(/\s+/g,'')})
    await authGoogle()
    // setUser(user);
    console.log(user)
  };

  // console.log(user)

  return <div id="google-login-button"></div>;
};

export default GoogleLoginButton;
