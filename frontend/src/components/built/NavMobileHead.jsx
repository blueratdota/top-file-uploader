import siteLogo from "../../images/site-logo-white.png";
import {
  mdiUpload,
  mdiSort,
  mdiMagnify,
  mdiFolderPlus,
  mdiMenu
} from "@mdi/js";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { useDisclosure, Drawer } from "@chakra-ui/react";
import SmallIconBtn from "../SmallIconButton";
import ModalFileUpload from "./ModalFileUpload";
import ModalFolderCreation from "./ModalFolderCreation";
import { useNavigate, useOutletContext } from "react-router-dom";
import DrawerMenu from "./DrawerMenu";

const NavMobile = ({
  sortType,
  sortAsc,
  handleSort,
  handleSetSortType,
  mutateFiles,
  mutateFolders
}) => {
  const context = useOutletContext();

  // for file upload
  const {
    isOpen: isOpenUploadModal,
    onOpen: onOpenUploadModal,
    onClose: onCloseUploadModal
  } = useDisclosure();
  // for folder creation
  const {
    isOpen: isOpenFolderCreateModal,
    onOpen: onOpenFolderCreateModal,
    onClose: onCloseFolderCreateModal
  } = useDisclosure();
  // for menu drawer
  const {
    isOpen: isOpenMenu,
    onOpen: onOpenMenu,
    onClose: onCloseMenu
  } = useDisclosure();
  const navigate = useNavigate();

  return (
    <>
      <div
        className={`bg-extGreen h-[70px] w-full p-3 flex fixed border-b ${
          isOpenMenu || isOpenFolderCreateModal || isOpenUploadModal
            ? "z-[0]"
            : "z-[1]"
        } `}
      >
        <div
          className="h-full basis-[30%] flex items-center cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        >
          <img src={siteLogo} alt="" className="h-[70%] object-contain " />
        </div>
        <div className="h-full basis-[70%] flex gap-1 grow-0 items-center [&>div>svg]:text-white [&>div>svg]:scale-[0.5] [&>div]:w-[46px] [&>div]:grow-0 justify-end">
          <SmallIconBtn
            icon={mdiUpload}
            onClick={() => {
              console.log("open upload");
              onOpenUploadModal();
            }}
          ></SmallIconBtn>
          <Menu flip={false}>
            <MenuButton className="scale-[0.5] w-[46px] text-white">
              <SmallIconBtn
                icon={mdiSort}
                onClick={() => {
                  console.log("open sort");
                }}
              ></SmallIconBtn>
            </MenuButton>
            <MenuList className="bg-extGray text-extWhite p-2 border border-gray-200 border-opacity-20 ">
              <MenuItem
                onClick={() => {
                  handleSetSortType("name");
                  if (sortType != "name") {
                    handleSort(false);
                  } else {
                    handleSort();
                  }
                }}
              >
                <span className="w-5">
                  {sortType == "name" ? (
                    <>{sortAsc ? <ChevronUpIcon /> : <ChevronDownIcon />}</>
                  ) : null}
                </span>{" "}
                Sort by Name
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleSetSortType("updatedAt");
                  if (sortType != "updatedAt") {
                    handleSort(false);
                  } else {
                    handleSort();
                  }
                }}
              >
                <span className="w-5">
                  {sortType == "updatedAt" ? (
                    <>{sortAsc ? <ChevronUpIcon /> : <ChevronDownIcon />}</>
                  ) : null}
                </span>{" "}
                Sort by Date
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleSetSortType("fileSize");
                  if (sortType != "fileSize") {
                    handleSort(false);
                  } else {
                    handleSort();
                  }
                }}
              >
                <span className="w-5">
                  {sortType == "fileSize" ? (
                    <>{sortAsc ? <ChevronUpIcon /> : <ChevronDownIcon />}</>
                  ) : null}
                </span>{" "}
                Sort by Size
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleSetSortType("downloadCount");
                  if (sortType != "downloadCount") {
                    handleSort(false);
                  } else {
                    handleSort();
                  }
                }}
              >
                <span className="w-5">
                  {sortType == "downloadCount" ? (
                    <>{sortAsc ? <ChevronUpIcon /> : <ChevronDownIcon />}</>
                  ) : null}
                </span>{" "}
                Sort by Downloads
              </MenuItem>
            </MenuList>
          </Menu>
          <SmallIconBtn
            icon={mdiMagnify}
            onClick={() => {
              console.log("open search");
            }}
          ></SmallIconBtn>
          <SmallIconBtn
            icon={mdiFolderPlus}
            onClick={() => {
              console.log("open add folder");
              onOpenFolderCreateModal();
            }}
          ></SmallIconBtn>
          <SmallIconBtn
            icon={mdiMenu}
            onClick={() => {
              onOpenMenu();
            }}
          ></SmallIconBtn>
        </div>
        <ModalFileUpload
          isOpen={isOpenUploadModal}
          onClose={onCloseUploadModal}
          mutateFiles={mutateFiles}
          mutateFolders={mutateFolders}
        />
        <ModalFolderCreation
          isOpen={isOpenFolderCreateModal}
          onClose={onCloseFolderCreateModal}
          mutateFiles={mutateFiles}
          mutateFolders={mutateFolders}
        />
      </div>
      <Drawer isOpen={isOpenMenu} placement="right" onClose={onCloseMenu}>
        <DrawerMenu onClose={onCloseMenu} isOpen={isOpenMenu}></DrawerMenu>
      </Drawer>
    </>
  );
};

export default NavMobile;
