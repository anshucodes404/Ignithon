import { createBrowserRouter } from "react-router";
import App from "./App";
import Landing from "./pages/Landing";
import ErrorPage from "./components/ErrorPage";
import ViewMap from "./pages/ViewMap";
import RaiseIssue from "./pages/RaiseIssue";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      //   { index: true, element: <HomePage /> },
      //   { path: "login", element: <LoginPage /> },

      { index: true, element: <Landing /> },
        { path: "view-map", element: <ViewMap /> },
      {path: "raise-issue", element: <RaiseIssue/>}
    ],
  },
]);

export default router;
