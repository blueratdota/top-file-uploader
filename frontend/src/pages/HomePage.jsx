import { useEffect, useState } from "react";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import NavMobile from "../components/built/NavMobileHead.jsx";
import SideBar from "../components/built/SideBar.jsx";
import NavTablet from "../components/built/NavTabletHeader.jsx";
import LoadingPage from "../components/built/LoadingPage.jsx";

const HomePage = () => {
  const navigate = useNavigate();
  const context = useOutletContext();

  useEffect(() => {
    if (context.profile.msg) {
      console.log("no logged in account");
      navigate("/login");
    }
  }, []);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 640px)" });

  return (
    <>
      {context.isLoadingFolders ? (
        <LoadingPage />
      ) : (
        <div className="sm:flex">
          {isTabletOrMobile ? null : <SideBar />}
          <main className="w-full">
            <nav>
              {isTabletOrMobile ? (
                <NavMobile></NavMobile>
              ) : (
                <NavTablet></NavTablet>
              )}
            </nav>
            <div className="pt-[70px] sm:pl-[220px] bg-extGray text-extWhite flex h-screen items-stretch ">
              <Outlet
                context={{
                  profile: context.profile
                }}
              />
            </div>
          </main>
        </div>
      )}
    </>
  );
};
export default HomePage;
