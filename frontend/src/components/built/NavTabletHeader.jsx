import siteLogo from "../../images/site-logo-white.png";
import Icon from "@mdi/react";
import {
  mdiUpload,
  mdiSort,
  mdiMagnify,
  mdiFolderPlus,
  mdiMenu,
  mdiFilter
} from "@mdi/js";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";
import SmallIconBtn from "../SmallIconButton";
import ModalFileUpload from "./ModalFileUpload";
import ModalFolderCreation from "./ModalFolderCreation";
import { useNavigate, useOutletContext } from "react-router-dom";

const NavTablet = ({
  sortType,
  sortAsc,
  handleSort,
  handleSetSortType,
  mutateFiles,
  mutateFolders,
  nav
}) => {
  const {
    isOpen: isOpenUploadModal,
    onOpen: onOpenUploadModal,
    onClose: onCloseUploadModal
  } = useDisclosure();
  const {
    isOpen: isOpenFolderCreateModal,
    onOpen: onOpenFolderCreateModal,
    onClose: onCloseFolderCreateModal
  } = useDisclosure();
  const navigate = useNavigate();
  return (
    <div
      className={`bg-extGreen h-[70px] right-0 w-[calc(100%-220px)] p-3 flex fixed border-b ${
        isOpenFolderCreateModal || isOpenUploadModal || nav ? "z-[0]" : "z-[1]"
      }`}
    >
      <div
        className="h-full basis-[30%] flex items-center cursor-pointer"
        onClick={() => {
          navigate("/");
        }}
      >
        <img src={siteLogo} alt="" className="h-[70%] object-contain " />
      </div>

      <div className="h-full basis-[70%] flex gap-1 grow-0 items-center justify-end">
        <div
          className="flex items-center [&>*]:text-extWhite [&>div]:w-[46px] [&>div>svg]:scale-[0.5] cursor-pointer"
          onClick={() => {
            onOpenUploadModal();
          }}
        >
          <SmallIconBtn icon={mdiUpload}></SmallIconBtn>
          <p>UPLOAD</p>
        </div>

        <Menu flip={false}>
          <MenuButton>
            <div className="flex items-center [&>*]:text-extWhite [&>div]:w-[46px] [&>div>svg]:scale-[0.5]  ">
              <SmallIconBtn
                icon={mdiSort}
                onClick={() => {
                  console.log("sort");
                }}
              ></SmallIconBtn>
              <p>SORT</p>
            </div>
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
                  <>{sortAsc ? <ChevronDownIcon /> : <ChevronUpIcon />}</>
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
                  <>{sortAsc ? <ChevronDownIcon /> : <ChevronUpIcon />}</>
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
                  <>{sortAsc ? <ChevronDownIcon /> : <ChevronUpIcon />}</>
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
                  <>{sortAsc ? <ChevronDownIcon /> : <ChevronUpIcon />}</>
                ) : null}
              </span>{" "}
              Sort by Downloads
            </MenuItem>
          </MenuList>
        </Menu>
        <div className="flex items-center [&>*]:text-extWhite [&>div]:w-[46px] [&>div>svg]:scale-[0.5] ">
          <SmallIconBtn
            icon={mdiFilter}
            onClick={() => {
              console.log("filter");
            }}
          ></SmallIconBtn>
          <p>FILTER</p>
        </div>
        <div className="flex items-center [&>*]:text-extWhite [&>div]:w-[46px] [&>div>svg]:scale-[0.5] ">
          <SmallIconBtn
            icon={mdiMagnify}
            onClick={() => {
              console.log("search");
            }}
          ></SmallIconBtn>
        </div>
        <div className="flex items-center [&>*]:text-extWhite [&>div]:w-[46px] [&>div>svg]:scale-[0.5] cursor-pointer">
          <SmallIconBtn
            icon={mdiFolderPlus}
            onClick={() => {
              onOpenFolderCreateModal();
            }}
          ></SmallIconBtn>
        </div>
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
  );
};
export default NavTablet;
