import {
  useLocation,
  useParams,
  Link,
  useNavigate,
  useOutletContext
} from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useMediaQuery } from "react-responsive";

const BreadCrumbs = ({ folders, sharedFolders }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const context = useOutletContext();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 640px)" });
  const arrPath = [];

  const mainPages = {
    "my-files": {
      name: "My Files",
      link: "/home/my-files",
      origin: "my-files"
    },
    "recent-uploads": {
      name: "Recent Uploads",
      link: "/home/recent-uploads",
      origin: "recent-uploads"
    },
    shared: { name: "Shared With Me", link: "/home/shared", origin: "shared" },
    trash: { name: "Trash", link: "/home/trash", origin: "trash" }
  };

  const { pathname } = useLocation();
  const currentMainPage =
    mainPages[pathname.split("/")[2]] || mainPages["my-files"];

  if (currentMainPage.name != "Shared With Me") {
    if (folders != undefined) {
      const parentFolder = (folderID) => {
        const findFolder = folders.find((folder) => {
          return folder.id == folderID;
        });
        try {
          if (!findFolder.parentFolderId) {
            arrPath.unshift(findFolder);
            return;
          } else {
            arrPath.unshift(findFolder);
            parentFolder(findFolder.parentFolderId);
          }
        } catch (error) {
          console.log(error);
          navigate("/");
        }
      };
      if (id) {
        parentFolder(id);
      }
    }
  } else {
    let viewableFolders = [];
    if (sharedFolders) {
      sharedFolders.forEach((folder) => {
        viewableFolders.push(folder.id);
      });
    }
    // function to find parent folder among accessible folders
    // sharedFolder == folders looped from /api/folder/get-all-shared
    // sharedFolder >> all folders you can access but not all directly shared, only the parent folders
    const parentFolder = (folderID) => {
      const findFolder = sharedFolders.find((folder) => {
        return folder.id == folderID;
      });

      try {
        if (!findFolder.parentFolderId) {
          arrPath.unshift(findFolder);
          return;
        } else {
          if (viewableFolders.includes(findFolder.parentFolderId)) {
            arrPath.unshift(findFolder);
            parentFolder(findFolder.parentFolderId);
            return;
          }
          arrPath.unshift(findFolder);
        }
      } catch (error) {
        console.log(error);
        navigate("/");
      }
    };
    if (id) {
      parentFolder(id);
    }
  }

  return (
    <Breadcrumb
      spacing="8px"
      separator={<ChevronRightIcon color="gray.500" />}
      className="my-auto ml-3 text-extWhite py-2 sm:text-sm"
    >
      <BreadcrumbItem>
        <BreadcrumbLink
          as={Link}
          to={`${currentMainPage.link}?sortAsc=true&sortType=name`}
          className="underline"
        >
          {currentMainPage.name}
        </BreadcrumbLink>
      </BreadcrumbItem>
      {arrPath.map((path, index) => {
        let L = arrPath.length;
        let maxL = isTabletOrMobile ? L - 2 : L - 3;
        if (index >= maxL) {
          return (
            <BreadcrumbItem key={path.id}>
              <BreadcrumbLink
                as={Link}
                to={`/home/${currentMainPage.origin}/folder/${path.id}?sortAsc=true&sortType=name`}
                className="underline"
              >
                {path.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          );
        }
      })}
    </Breadcrumb>
  );
};
export default BreadCrumbs;
