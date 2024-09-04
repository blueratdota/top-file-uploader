import {
  mdiFolderOutline,
  mdiDotsVertical,
  mdiDeleteOutline,
  mdiRestore,
  mdiCardTextOutline,
  mdiRenameOutline,
  mdiContentCopy,
  mdiFolderMoveOutline,
  mdiDownloadOutline,
  mdiLink,
  mdiShareOutline,
  mdiShareOffOutline
} from "@mdi/js";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  InputGroup,
  Input,
  Spinner
} from "@chakra-ui/react";

import { useState } from "react";

import SmallIconBtn from "./SmallIconButton";
import { Link, useOutletContext } from "react-router-dom";
import Icon from "@mdi/react";
import MenuFolderToTrash from "./menu-items/MenuFolderToTrash";
import MenuDetails from "./menu-items/MenuDetails";
import MenuRename from "./menu-items/MenuRename";
import ModalRenameFolder from "./menu-items/ModalRenameFolder";
import ModalDisplayTemplate from "./menu-items/ModalDisplayTemplate";
import ModalShareFolder from "./menu-items/ModalShareFolder";
import ModalUnshareFolder from "./menu-items/ModalUnshareFolder";
import ModalMoveFolder from "./menu-items/ModalMoveFolder";
import ModalCopyFolder from "./menu-items/ModalCopyFolder";

const EntryFolder = ({ folder }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalHeader, setModalHeader] = useState(() => {
    return "Empty Header";
  });
  const [modalBody, setModalBody] = useState(() => {
    return <></>;
  });
  const context = useOutletContext();
  // for fixing navbar z-index issues
  const { setNav } = context;
  // FOLDER DETAILS MODAL
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal
  } = useDisclosure();
  // RENAME MODAL
  const {
    isOpen: isOpenRenameModal,
    onOpen: onOpenRenameModal,
    onClose: onCloseRenameModal
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
  // MOVE FOLDER MODAL
  const {
    isOpen: isOpenMoveModal,
    onOpen: onOpenMoveModal,
    onClose: onCloseMoveModal
  } = useDisclosure();
  // COPY FOLDER MODAL
  const {
    isOpen: isOpenCopyModal,
    onOpen: onOpenCopyModal,
    onClose: onCloseCopyModal
  } = useDisclosure();

  const existingFolders = (() => {
    let folderCount = 0;
    if (folder.childFolder == undefined) return folderCount;
    folder.childFolder.forEach((f) => {
      if (!f.inTrash) {
        folderCount++;
      }
    });
    return folderCount;
  })();
  const existingFiles = (() => {
    let fileCount = 0;
    if (folder.storedFiles == undefined) return fileCount;
    folder.storedFiles.forEach((f) => {
      if (!f.inTrash) {
        fileCount++;
      }
    });
    return fileCount;
  })();

  return (
    <div
      className="flex items-center justify-between h-11 w-full py-8 border-b"
      // onClick={() => {
      //   console.log(folder);
      // }}
    >
      <Link
        className="flex items-center w-full"
        onClick={() => {}}
        to={`/home/my-files/folder/${folder.id}?sortAsc=true&sortType=name`}
      >
        <div className="w-14 px-2">
          <Icon path={mdiFolderOutline} className="w-full"></Icon>
        </div>
        <div className="flex-1">
          <div>{folder.name}</div>
          <div className="text-sm text-opacity-50">
            <span>{existingFolders} folders,</span>{" "}
            <span>{existingFiles} files</span>
          </div>
        </div>
      </Link>

      <Menu zIndex={"dropdown"}>
        <MenuButton className="scale-[0.5] w-[46px] text-white">
          <SmallIconBtn icon={mdiDotsVertical}></SmallIconBtn>
        </MenuButton>
        <MenuList
          zIndex={1}
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
            <span className="w-5 mr-2">
              <Icon path={mdiLink} />
            </span>{" "}
            Copy Link
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
          <MenuRename
            folder={folder}
            onOpenRenameModal={onOpenRenameModal}
            onCloseRenameModal={onCloseRenameModal}
            setNav={setNav}
          />
          <MenuDetails
            folder={folder}
            setModalHeader={setModalHeader}
            setModalBody={setModalBody}
            setNav={setNav}
            onOpenModal={onOpenModal}
            onCloseModal={onCloseModal}
          />
          <MenuItem
            onClick={() => {
              onOpenUnshareModal();
              setNav(true);
            }}
          >
            <span className="w-5 mr-2">
              <Icon path={mdiShareOffOutline} className="text-red-600" />
            </span>{" "}
            Unshare
          </MenuItem>
          <MenuFolderToTrash
            folder={folder}
            setModalHeader={setModalHeader}
            setModalBody={setModalBody}
            setNav={setNav}
            onOpenModal={onOpenModal}
            onCloseModal={onCloseModal}
          />
        </MenuList>
      </Menu>
      {/* STATE BASED MODAL */}
      <ModalDisplayTemplate
        isOpen={isOpenModal}
        onClose={onCloseModal}
        setNav={context.setNav}
        modalHeader={modalHeader}
        modalBody={modalBody}
      />
      {/* RENAME MODAL */}
      <ModalRenameFolder
        isOpen={isOpenRenameModal}
        onClose={onCloseRenameModal}
        folder={folder}
      />
      {/* SHARE MODAL */}
      <ModalShareFolder
        isOpen={isOpenShareModal}
        onClose={onCloseShareModal}
        folder={folder}
        setNav={setNav}
      />
      {/* UNSHARE MODAL */}
      <ModalUnshareFolder
        isOpen={isOpenUnshareModal}
        onClose={onCloseUnshareModal}
        folder={folder}
        setNav={setNav}
      />
      {/* MOVE FOLDER MODAL */}
      <ModalMoveFolder
        isOpen={isOpenMoveModal}
        onClose={onCloseMoveModal}
        folder={folder}
        setNav={setNav}
      />
      {/* COPY FOLDER MODAL */}
      <ModalCopyFolder
        isOpen={isOpenCopyModal}
        onClose={onCloseCopyModal}
        folder={folder}
        setNav={setNav}
      />
    </div>
  );
};

export default EntryFolder;
