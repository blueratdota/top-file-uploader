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
import RecentUploads from "./pages/RecentUploads.jsx";
import SharedWithUser from "./pages/SharedWithUser.jsx";
import Trash from "./pages/Trash.jsx";
import SharedFolderContent from "./pages/SharedFolderContent.jsx";

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
          {
            index: true,
            element: (
              <Navigate
                to="/home/my-files?sortAsc=true&sortType=name"
                replace
              />
            )
          },
          { path: "/home/my-files", element: <MyFiles /> },
          { path: "/home/my-files/folder/:id", element: <FolderContent /> },
          { path: "/home/recent-uploads", element: <RecentUploads /> },
          { path: "/home/shared", element: <SharedWithUser /> },
          { path: "/home/shared/folder/:id", element: <SharedFolderContent /> },
          { path: "/home/trash", element: <Trash /> },
          { path: "/home/trash/folder/:id", element: <FolderContent /> },
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
