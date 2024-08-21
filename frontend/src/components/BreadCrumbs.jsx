import { useLocation, useParams, Link } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";

const BreadCrumbs = ({ folders }) => {
  const { id } = useParams();
  const arrPath = [];
  if (folders != undefined) {
    const parentFolder = (folderID) => {
      const findFolder = folders.find((folder) => {
        return folder.id == folderID;
      });
      if (!findFolder.parentFolderId) {
        arrPath.unshift(findFolder);
        return;
      } else {
        arrPath.unshift(findFolder);
        parentFolder(findFolder.parentFolderId);
      }
    };
    if (id) {
      parentFolder(id);
    }
  }
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
  console.log(currentMainPage);

  return (
    // <div className="flex">
    //   <div>
    //     {mainPages[pathname.split("/")[2]]} {arrPath.length >= 1 ? ">" : ""}
    //   </div>
    //   {arrPath.map((path, index) => {
    //     return (
    //       <div key={path.id}>
    //         {path.name} {arrPath.length - 1 == index ? "" : ">"}
    //       </div>
    //     );
    //   })}
    // </div>

    <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
      <BreadcrumbItem>
        <BreadcrumbLink as={Link} to={currentMainPage.link}>
          {currentMainPage.name}
        </BreadcrumbLink>
      </BreadcrumbItem>
      {arrPath.map((path, index) => {
        return (
          //   <div key={path.id}>
          //     {path.name}
          //   </div>
          <BreadcrumbItem key={path.id}>
            <BreadcrumbLink
              as={Link}
              to={`/home/${currentMainPage.origin}/folder/${path.id}`}
            >
              {path.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
};
export default BreadCrumbs;
