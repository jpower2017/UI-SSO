import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import nJwt from "njwt";

/*********/
const REDIRECT_INIT = "/api/auth/saml/redirect";
const REDIRECT_KEY = "/api/auth/jwt/key";
const API_ENCRYPT = "/api/auth/jwt/encrypt";
const API_DECRYPT = "/api/auth/jwt/decrypt";
//*** ??? REMOVE /PORTAL/ ??????  ***/
const REDIRECT_AUTHENTICATED = "/portal/?sessionKey=";
/*********/

let localMemory = null;
let storeJWT = null;

const fetchWrap = async (body, url) => {
  console.log("fetchWrap f");
  const requestHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json"
  };
  let options = {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify(body),
    credentials: "include"
  };
  const res = await fetch(url, options);
  res.ok ? console.log("response ok") : console.log("response not ok");
  const data = await res.json();
  return data;
};

const getSessionKey = localMemory => {
  const secret = "fadd25bc-083f-4bfa-b991-27082b2c8771";
  const jwt = nJwt.create({ token: localMemory }, secret, "HS256");
  const token = jwt.compact();
  return token;
};
const redirectURL = localMemory => {
  console.log("REDIRECTURL " + localMemory);
  if (!localMemory) {
    console.log("NO LOCAL MEMORY VAR");
    return;
  }
  //window.location.replace(REDIRECT_AUTHENTICATED + getSessionKey(localMemory));
  window.location =
    window.location.protocol +
    "//" +
    window.location.host +
    REDIRECT_AUTHENTICATED +
    getSessionKey(localMemory);
};
const hasJWT = () => {
  console.log("JWT = " + localStorage.getItem("JWT"));
  localStorage.getItem("JWT") ? console.log("yes jwt") : console.log("no jwt");
  return localStorage.getItem("JWT");
};
const containsQuery = str => {
  const pattern = /[?]/;
  return pattern.test(str);
};
const successQuery = str => {
  const pattern = /[?status=success]/;
  return pattern.test(str);
};
const bRedirectURL = str => {
  const pattern = /portal/;
  return pattern.test(str);
};

const onAction = (action, pin) => {
  console.log("action pin " + [action, pin]);
  switch (action) {
    case "store":
      console.log("ACTION STORE.  ");
      storeJWT = true;
      //localStorage.setItem("JWT", localMemory);
      break;
    case "skip":
      console.log("ACTION SKIP");
      //value is in var localMemory
      console.log("localMemory: " + localMemory);
      redirectURL(localMemory);
      break;
    case "success":
      console.log("ACTION SUCCESS  PIN: " + pin);
      hasJWT() ? decrypt(hasJWT(), pin) : encrypt(pin);
      break;
    case "forgotPin":
      console.log("INDEX ACTION forgotPIN");
      /* clear stored jwt */
      //localStorage.setItem("JWT", "");
      localStorage.removeItem("JWT");
      /*redirect */
      loadLogic();
      break;
    default:
  }
};
const initial = async () => {
  console.log("initial f ");
  const data = await fetchWrap(
    { redirect: window.location.href },
    REDIRECT_INIT
  );
  window.location.replace(data.login_url);
};
const sendKey = async url => {
  console.log("sendKey f  url " + url);
  const valueKey = url.substr(url.indexOf("key=") + 4);
  /** RETURNS JWT **/
  const data = await fetchWrap({ key: valueKey }, REDIRECT_KEY);
  localMemory = data.user_jwt;
  localMemory
    ? showApp()
    : console.log("ERROR ERROR NO USER JWT RETURNED FROM REDIRECT_KEY");
};
const encrypt = async pin => {
  console.log("encrypt f  pin: " + pin);
  /**RETURNS ENCRYPTED TOKEN **/
  const data = await fetchWrap(
    { jwt: localMemory, passcode: pin },
    API_ENCRYPT
  );
  finalSteps(data);
  redirectURL(localMemory);
};
const decrypt = async (str, pin) => {
  console.log("decrypt f obj: " + str);
  const data = await fetchWrap({ jwt: str, passcode: pin }, API_DECRYPT);
  if (data.errors) {
    console.log("error message= " + data.errors);
    alert("Pin failed.  Try again");
    return;
  }
  redirectURL(data.user_jwt);
};
const finalSteps = ejwt => {
  console.log("ejwt : " + JSON.stringify(ejwt));
  localStorage.setItem("JWT", JSON.stringify(ejwt));
};
const showApp = (pinTrys = 2) => {
  console.log("showApp f");
  return ReactDOM.render(
    <App action={onAction} pinTrys={pinTrys} />,
    document.getElementById("root")
  );
};
/* IF QUERY   ELSE JWT OR NO JWT */
const loadLogic = () => {
  console.log("loadLogic f href: " + window.location.href);
  const evalURL = window.location.href;
  if (bRedirectURL(evalURL)) {
    console.log("bRedirectURL : " + bRedirectURL(window.location.href));
    return;
  }
  if (hasJWT()) {
    console.log("hasJWT f called");
    /* SHOW APP BUT DO NOT ASK IF WANT TO SAVE PIN */
    showApp(1);
  } else {
    console.log("noJWT");

    if (containsQuery(evalURL) && successQuery(evalURL)) {
      sendKey(evalURL);
    } else {
      initial();
    }
  }
};
loadLogic();
