
import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import FeesPage from "../pages/fees/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/fees",
    element: <FeesPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
