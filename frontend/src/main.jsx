import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import LoginPage from "./pages/Login.jsx";
import HomePage from "./pages/HomePage.jsx";
import MyFiles from "./pages/MyFiles.jsx";
import LoadingPage from "./components/built/LoadingPage.jsx";
import FolderContent from "./pages/FolderContent.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: "/login", element: <LoginPage /> },
      {
        path: "/home",
        element: <HomePage />,
        children: [
          { index: true, element: <Navigate to="/home/my-files" replace /> },
          { path: "/home/my-files", element: <MyFiles /> },
          { path: "/home/folder/:id", element: <FolderContent /> },
          { path: "/home/loading", element: <LoadingPage /> }
        ]
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
