import "./App.css";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import Notifications from "./components/Notifications";
import ConfirmModal from "./components/ConfirmModal";
import { CurrencyProvider } from "./context/CurrencyContext";
// import Notification from "components/Notifications";
// import Loader from "components/Modals/Loader";

// import { MIC01CProvider } from "context/MIC01CContext";

function App() {
  return (
    <CurrencyProvider>
      <div className="relative h-screen">
        {/* <Loader /> */}
        <Notifications />
        <ConfirmModal />
        <RouterProvider router={router} />
      </div>
    </CurrencyProvider>
  );
}

export default App;
