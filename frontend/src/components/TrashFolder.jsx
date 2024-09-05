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
  mdiShareOutline
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
  ModalCloseButton
} from "@chakra-ui/react";

import { useState } from "react";

import SmallIconBtn from "./SmallIconButton";
import { Link, useOutletContext } from "react-router-dom";
import Icon from "@mdi/react";
import MenuFolderDelete from "./menu-items/MenuFolderDelete";
import MenuFolderRestore from "./menu-items/MenuFolderRestore";
import ModalDeleteFolder from "./menu-items/ModalDeleteFolder";
import ModalRestoreFolder from "./menu-items/ModalRestoreFolder";

const TrashFolder = ({ folder }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalHeader, setModalHeader] = useState(() => {
    return "Empty Header";
  });
  const [modalBody, setModalBody] = useState(() => {
    return <></>;
  });
  const context = useOutletContext();
  const { setNav } = context;
  // for delete modal
  const {
    isOpen: isOpenDeleteModal,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal
  } = useDisclosure();
  // for restore modal
  const {
    isOpen: isOpenRestoreModal,
    onOpen: onOpenRestoreModal,
    onClose: onCloseRestoreModal
  } = useDisclosure();
  return (
    <div className="flex items-center justify-between h-11 w-full py-8 border-b">
      <div className="w-14 px-2">
        <Icon path={mdiFolderOutline} className="w-full"></Icon>
      </div>
      <div className="flex-1">
        <div>{folder.name}</div>
        <div className="text-sm text-opacity-50">
          <span>
            {folder.childFolder == undefined ? 0 : folder.childFolder.length}{" "}
            folders,
          </span>{" "}
          <span>
            {folder.storedFiles == undefined ? 0 : folder.storedFiles.length}{" "}
            files
          </span>
        </div>
      </div>

      <Menu zIndex={"dropdown"}>
        <MenuButton
          className="scale-[0.5] w-[46px] text-white"
          onClick={() => {
            console.log(folder);
          }}
        >
          <SmallIconBtn icon={mdiDotsVertical}></SmallIconBtn>
        </MenuButton>
        <MenuList
          zIndex={1}
          className="bg-extGray text-extWhite p-2 pr-7 border border-gray-200 border-opacity-20 [&>button]:py-0.5"
        >
          <MenuFolderRestore
            setNav={setNav}
            onOpenRestoreModal={onOpenRestoreModal}
          />
          <MenuFolderDelete
            setNav={setNav}
            onOpenDeleteModal={onOpenDeleteModal}
          />
        </MenuList>
      </Menu>
      <ModalDeleteFolder
        isOpen={isOpenDeleteModal}
        onClose={onCloseDeleteModal}
        folder={folder}
        setNav={setNav}
      />
      <ModalRestoreFolder
        isOpen={isOpenRestoreModal}
        onClose={onCloseRestoreModal}
        folder={folder}
        setNav={setNav}
      />
    </div>
  );
};

export default TrashFolder;
