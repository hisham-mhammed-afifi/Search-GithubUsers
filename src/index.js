import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { GithubProvider } from "./context/context";
import { Auth0Provider } from "@auth0/auth0-react";
import history from "./utils/history";

const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.returnTo ? appState.returnTo : window.location.pathname
  );
};

const providerConfig = {
  domain: "dev-eouvf9h9.us.auth0.com",
  clientId: "B2eDtPsMYmYlByIwBPBBKAbO4fjzEFYt",
  redirectUri: window.location.origin,
  onRedirectCallback,
};

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider {...providerConfig}>
      <GithubProvider>
        <App />
      </GithubProvider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
