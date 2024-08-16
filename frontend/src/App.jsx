import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useSWR from "swr";

// installs
// npm i react-router-dom @chakra-ui/react @emotion/react @emotion/styled framer-motion swr

function App() {
  // SWR FETCH STUFF
  const fetcher = (url) =>
    fetch(url, { credentials: "include" }).then((res) => res.json());
  const {
    data: profile,
    error: errorProfile,
    isLoading: isLoadingProfile
  } = useSWR("http://localhost:3000/api/users/profile", fetcher, {
    revalidateOnFocus: false
  });
  if (isLoadingProfile) {
    return <div>Loading...</div>;
  }

  console.log(profile);

  return (
    <>
      <div>
        <Outlet context={{ profile: profile }}></Outlet>
        <div>{profile ? profile.name : null}</div>
      </div>
    </>
  );
}

export default App;
