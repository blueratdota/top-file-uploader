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
  const [searchParams, setSearchParams] = useSearchParams({
    sortAsc: false,
    sortType: "name"
  });
  const [currentPage, setCurrentPage] = useState(["no page"]);
  const [breadcrumbs, setBreadcrums] = useState([]);
  const sortAsc = searchParams.get("sortAsc") === "true";
  const sortType = searchParams.get("sortType");
  const isAsc = (() => {
    if (sortAsc) return "asc";
    else return "desc";
  })();
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

  const navigate = useNavigate();
  const context = useOutletContext();

  useEffect(() => {
    if (context.profile.msg) {
      console.log("no logged in account");
      navigate("/login");
      return;
    }
  }, []);

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

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 640px)" });

  return (
    <>
      {context.isLoadingProfile ? (
        <LoadingPage>
          <p>Loading Home Page</p>
        </LoadingPage>
      ) : (
        <div className="sm:flex">
          {isTabletOrMobile ? null : (
            <SideBar
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
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
                ></NavMobile>
              ) : (
                <NavTablet
                  sortType={sortType}
                  sortAsc={sortAsc}
                  handleSort={handleSort}
                  handleSetSortType={handleSetSortType}
                  mutateFiles={mutateFiles}
                  mutateFolders={mutateFolders}
                ></NavTablet>
              )}
            </nav>
            <div className="pt-[70px] sm:pl-[220px] max-w-full flex bg-gray-400 border-y">
              <BreadCrumbs folders={folders}></BreadCrumbs>
            </div>
            <div className="sm:pl-[220px] bg-extGray text-extWhite flex h-[calc(100%-110px)] min-h-screen items-stretch ">
              <Outlet
                context={{
                  profile: context.profile,
                  sortAsc,
                  sortType,
                  folders: folders,
                  files: files,
                  isLoadingFiles: isLoadingFiles,
                  isLoadingFolders: isLoadingFolders,
                  breadcrumbs: breadcrumbs,
                  setBreadcrums: setBreadcrums,
                  setCurrentPage: setCurrentPage,
                  mutateFiles: mutateFiles,
                  mutateFolders: mutateFolders
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
