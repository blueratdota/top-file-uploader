import {
  mdiFileOutline,
  mdiDotsVertical,
  mdiCardTextOutline,
  mdiRenameOutline,
  mdiContentCopy,
  mdiFolderMoveOutline,
  mdiShareOutline
} from "@mdi/js";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import SmallIconBtn from "./SmallIconButton";
import Icon from "@mdi/react";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import ModalDisplayTemplate from "./menu-items/ModalDisplayTemplate";
import MenuFileToTrash from "./menu-items/MenuFileToTrash";
import ModalToTrashFile from "./menu-items/ModalToTrashFile";
import ModalDetailsFile from "./menu-items/ModalDetailsFile";
import ModalRenameFile from "./menu-items/ModalRenameFile";
import ModalCopyFile from "./menu-items/ModalCopyFile";
import ModalMoveFile from "./menu-items/ModalMoveFile";
import ModalShareFile from "./menu-items/ModalShareFile";
import ModalUnshareFile from "./menu-items/ModalUnshareFile";
const EntryFile = ({ file }) => {
  const context = useOutletContext();
  // for fixing navbar z-index issues
  const { setNav } = context;
  // FILE TO-TRASH MODAL
  const {
    isOpen: isOpenTrashModal,
    onOpen: onOpenTrashModal,
    onClose: onCloseTrashModal
  } = useDisclosure();
  // FILE DETAILS MODAL
  const {
    isOpen: isOpenDetailsModal,
    onOpen: onOpenDetailsModal,
    onClose: onCloseDetailsModal
  } = useDisclosure();
  // FILE RENAME MODAL
  const {
    isOpen: isOpenRenameModal,
    onOpen: onOpenRenameModal,
    onClose: onCloseRenameModal
  } = useDisclosure();
  // FILE COPY MODAL
  const {
    isOpen: isOpenCopyModal,
    onOpen: onOpenCopyModal,
    onClose: onCloseCopyModal
  } = useDisclosure();
  // FILE MOVE MODAL
  const {
    isOpen: isOpenMoveModal,
    onOpen: onOpenMoveModal,
    onClose: onCloseMoveModal
  } = useDisclosure();
  // FOLDER SHARE MODAL
  const {
    isOpen: isOpenShareModal,
    onOpen: onOpenShareModal,
    onClose: onCloseShareModal
  } = useDisclosure();
  // FOLDER UNSHARE MODAL
  const {
    isOpen: isOpenUnshareModal,
    onOpen: onOpenUnshareModal,
    onClose: onCloseUnshareModal
  } = useDisclosure();
  return (
    <div className="flex items-center h-11 w-full py-8 border-b">
      <div className="w-14 px-2">
        <Icon path={mdiFileOutline} className="w-full"></Icon>
      </div>
      <div className="flex-1">
        <div>{file.name}</div>
        <div className="text-sm text-opacity-50">
          <span>
            {file.downloadCount == undefined ? 0 : file.downloadCount}{" "}
            downloads,
          </span>{" "}
          <span>{file.fileSize} bytes</span>
        </div>
      </div>
      <div className="w-11">
        <Menu>
          <MenuButton
            className="scale-[0.5] w-[46px] text-white z-0"
            onClick={() => {
              console.log(file);
            }}
          >
            <SmallIconBtn icon={mdiDotsVertical}></SmallIconBtn>
          </MenuButton>
          <MenuList
            gap={10}
            zIndex={9999}
            className="bg-extGray text-extWhite p-2 pr-7 border border-gray-200 border-opacity-20 [&>button]:py-0.5"
          >
            <MenuItem
              onClick={() => {
                onOpenShareModal();
                setNav(true);
              }}
            >
              <span className="w-5 mr-2">
                <Icon path={mdiShareOutline} />
              </span>{" "}
              Share
            </MenuItem>
            <MenuItem>
              <span className="w-5">o</span> Copy Link
            </MenuItem>
            <MenuItem
              onClick={async () => {
                console.log(`download file ${file.id}`);
                // const response = await fetch(
                //   `${import.meta.env.VITE_SERVER}/api/files/download/${
                //     file.id
                //   }`,
                //   {
                //     method: "GET",
                //     credentials: "include",
                //     headers: { "Content-Type": "application/json" }
                //   }
                // );
                window.open(
                  `${import.meta.env.VITE_SERVER}/api/files/download/${file.id}`
                );
              }}
            >
              <span className="w-5">o</span> Download
            </MenuItem>
            <MenuItem
              onClick={() => {
                onOpenMoveModal();
                setNav(true);
              }}
            >
              <span className="w-5 mr-2">
                <Icon path={mdiFolderMoveOutline} />
              </span>{" "}
              Move to...
            </MenuItem>
            <MenuItem
              onClick={() => {
                onOpenCopyModal();
                setNav(true);
              }}
            >
              <span className="w-5 mr-2">
                <Icon path={mdiContentCopy} />
              </span>{" "}
              Copy to...
            </MenuItem>
            <MenuItem
              onClick={() => {
                onOpenRenameModal();
                setNav(true);
              }}
            >
              <span className="w-5 mr-2">
                <Icon path={mdiRenameOutline} />
              </span>{" "}
              Rename
            </MenuItem>
            <MenuItem
              onClick={() => {
                onOpenDetailsModal();
                setNav(true);
              }}
            >
              <span className="w-5 mr-2">
                <Icon path={mdiCardTextOutline} />
              </span>{" "}
              Details
            </MenuItem>
            <MenuFileToTrash
              file={file}
              setNav={setNav}
              onOpenTrashModal={onOpenTrashModal}
            />
          </MenuList>
        </Menu>
        {/* FILE TO TRASH */}
        <ModalToTrashFile
          isOpen={isOpenTrashModal}
          onClose={onCloseTrashModal}
          file={file}
          setNav={setNav}
        />
        {/* FILE DETAILS */}
        <ModalDetailsFile
          isOpen={isOpenDetailsModal}
          onClose={onCloseDetailsModal}
          file={file}
          setNav={setNav}
        />
        {/* FILE RENAME */}
        <ModalRenameFile
          isOpen={isOpenRenameModal}
          onClose={onCloseRenameModal}
          file={file}
          setNav={setNav}
        />
        {/* FILE COPY */}
        <ModalCopyFile
          isOpen={isOpenCopyModal}
          onClose={onCloseCopyModal}
          file={file}
          setNav={setNav}
        />
        {/* FILE MOVE */}
        <ModalMoveFile
          isOpen={isOpenMoveModal}
          onClose={onCloseMoveModal}
          file={file}
          setNav={setNav}
        />
        <ModalShareFile
          isOpen={isOpenShareModal}
          onClose={onCloseShareModal}
          file={file}
          setNav={setNav}
        />
        <ModalUnshareFile
          isOpen={isOpenUnshareModal}
          onClose={onCloseUnshareModal}
          file={file}
          setNav={setNav}
        />
      </div>
    </div>
  );
};

export default EntryFile;
