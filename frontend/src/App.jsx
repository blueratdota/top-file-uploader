import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import useSWR from "swr";
import LoadingPage from "./components/built/LoadingPage";

// installs
// npm i react-router-dom @chakra-ui/react @chakra-ui/icons @emotion/react @emotion/styled framer-motion swr react-responsive @mdi/react @mdi/js

function App() {
  // SWR FETCH STUFF

  const navigate = useNavigate();
  const fetcher = (url) =>
    fetch(url, { credentials: "include" }).then((res) => res.json());
  const {
    data: profile,
    error: errorProfile,
    isLoading: isLoadingProfile
  } = useSWR("http://localhost:3000/api/users/profile", fetcher, {
    revalidateOnFocus: false
  });
  console.log("profile loading", isLoadingProfile);
  if (isLoadingProfile) {
    return (
      <LoadingPage>
        <p>Loading App: Profile</p>
      </LoadingPage>
    );
  }

  setTimeout(() => {}, 2000);

  return (
    <>
      <div>
        <Outlet
          context={{
            profile: profile,
            isLoadingProfile: isLoadingProfile
          }}
        ></Outlet>
      </div>
    </>
  );
}

export default App;
