import ScrollToTop from "./base-components/ScrollToTop";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./stores/store";
import Router from "./router";
import "./assets/css/app.css";
import { AlertProvider } from "./ContextProvider/AlertContext";
import { FranchiseeProvider } from "./ContextProvider/FranchiseeContext";
import { LoginProvider } from "./ContextProvider/LoginContext";
import TitleManager from "./components/TitleManager/TitleManager";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <LoginProvider>
      <FranchiseeProvider>
        <AlertProvider>
          <Provider store={store}>
            <TitleManager />
            <Router />
          </Provider>
        </AlertProvider>
        <ScrollToTop />
      </FranchiseeProvider>
    </LoginProvider>
  </BrowserRouter>
);
