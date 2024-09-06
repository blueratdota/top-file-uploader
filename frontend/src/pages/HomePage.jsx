import { useEffect, useState } from "react";
import {
  Outlet,
  useNavigate,
  useOutletContext,
  useSearchParams
} from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import NavMobile from "../components/built/NavMobileHead.jsx";
import SideBar from "../components/built/SideBar.jsx";
import NavTablet from "../components/built/NavTabletHeader.jsx";
import LoadingPage from "../components/built/LoadingPage.jsx";
import useSWR from "swr";
import BreadCrumbs from "../components/BreadCrumbs.jsx";

const HomePage = () => {
  // SEARCH PARAMS FUNCTIONS
  const [searchParams, setSearchParams] = useSearchParams({
    sortAsc: false,
    sortType: "name"
  });
  const sortAsc = searchParams.get("sortAsc") === "true";
  const sortType = searchParams.get("sortType");
  const isAsc = (() => {
    if (sortAsc) return "asc";
    else return "desc";
  })();
  const handleSort = (boolean) => {
    const value = (() => {
      if (boolean == false) return false;
      else return !sortAsc;
    })();
    setSearchParams(
      (prev) => {
        prev.set("sortAsc", value);
        return prev;
      },
      { replace: true }
    );
  };
  const handleSetSortType = (type) => {
    setSearchParams(
      (prev) => {
        prev.set("sortType", type);
        return prev;
      },
      { replace: true }
    );
  };

  // FETCHER FUNCTIONS
  const fetcher = (url) =>
    fetch(url, { credentials: "include" }).then((res) => res.json());
  const {
    data: folders,
    error: errorFolders,
    isLoading: isLoadingFolders,
    mutate: mutateFolders
  } = useSWR(
    `http://localhost:3000/api/folders/get-all/${sortType}/${isAsc}`,
    fetcher,
    {
      revalidateOnFocus: false
    }
  );
  const {
    data: files,
    error: errorFiles,
    isLoading: isLoadingFiles,
    mutate: mutateFiles
  } = useSWR(
    `http://localhost:3000/api/files/get-all/${sortType}/${isAsc}`,
    fetcher,
    {
      revalidateOnFocus: false
    }
  );
  const {
    data: sharedFolders,
    error: errorSharedFolders,
    isLoading: isLoadingSharedFolders,
    mutate: mutateSharedFolders
  } = useSWR(
    `http://localhost:3000/api/folders/get-all-shared/${sortType}/${isAsc}`,
    fetcher,
    {
      revalidateOnFocus: false
    }
  );
  const {
    data: sharedFiles,
    error: errorSharedFiles,
    isLoading: isLoadingSharedFiles,
    mutate: mutateSharedFiles
  } = useSWR(
    `http://localhost:3000/api/files/get-all-shared/${sortType}/${isAsc}`,
    fetcher,
    {
      revalidateOnFocus: false
    }
  );

  const navigate = useNavigate();
  const context = useOutletContext();
  // console.log(context.profile);
  useEffect(() => {
    if (context.profile.msg) {
      console.log("no logged in account");
      navigate("/login");
      return;
    }
  }, []);
  // FOR RESPONSIVE DESIGN
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 640px)" });
  // FOR FIXING NAVBAR Z-INDEX ISSUE
  const [nav, setNav] = useState(false);
  // console.log(sharedFolders);

  return (
    <>
      {context.isLoadingProfile ? (
        <LoadingPage>
          <p>Loading Home Page</p>
        </LoadingPage>
      ) : (
        <div className="sm:flex ">
          {isTabletOrMobile ? null : <SideBar />}
          <main className="w-full overflow-hidden">
            <nav>
              {isTabletOrMobile ? (
                <NavMobile
                  sortType={sortType}
                  sortAsc={sortAsc}
                  handleSort={handleSort}
                  handleSetSortType={handleSetSortType}
                  mutateFiles={mutateFiles}
                  mutateFolders={mutateFolders}
                  nav={nav}
                ></NavMobile>
              ) : (
                <NavTablet
                  sortType={sortType}
                  sortAsc={sortAsc}
                  handleSort={handleSort}
                  handleSetSortType={handleSetSortType}
                  mutateFiles={mutateFiles}
                  mutateFolders={mutateFolders}
                  nav={nav}
                ></NavTablet>
              )}
            </nav>
            <div className="pt-[70px] sm:pl-[220px] max-w-full flex bg-gray-400 border-y">
              <BreadCrumbs
                folders={folders}
                sharedFolders={sharedFolders}
              ></BreadCrumbs>
            </div>
            <div className="sm:pl-[220px] bg-extGray text-extWhite flex h-[calc(100%-110px)] min-h-screen items-stretch ">
              <Outlet
                context={{
                  // FROM APP >> PASSING DOWN THE DATA
                  profile: context.profile,
                  // SEARCH PARAMS
                  sortAsc,
                  sortType,
                  // DATA VARIABLES FROM SWR GET REQUESTS
                  folders: folders,
                  files: files,
                  sharedFolders: sharedFolders,
                  sharedFiles: sharedFiles,
                  // LOADING VARIABLES FROM SWR GET REQUESTS
                  isLoadingFiles: isLoadingFiles,
                  isLoadingFolders: isLoadingFolders,
                  isLoadingSharedFolders: isLoadingSharedFolders,
                  isLoadingSharedFiles: isLoadingSharedFiles,
                  // FOR UPDATING FILES & FOLDERS EVERY ACTION
                  mutateFiles: mutateFiles,
                  mutateFolders: mutateFolders,
                  // FIXING NAV BAR ISSUE
                  nav: nav,
                  setNav: setNav
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
