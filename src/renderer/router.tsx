import { createHashRouter } from "react-router-dom";
import { Layout } from "@renderer/components";
// import ErrorPage from "./pages/error-page";
import Landing from "./pages/landing";
import Home from "./pages/home";

export default createHashRouter([
  {
    path: "/",
    // element: <Layout />,
    // errorElement: <ErrorPage />,
    children: [
      { index: true, element:<Layout /> }
    ],
  },
  {
    path: "/home",
    element: <Home/>  
  },
  { path: "/landing", element: <Landing /> },
]);
