import { mdiFileOutline, mdiDotsVertical } from "@mdi/js";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import SmallIconBtn from "./SmallIconButton";
import Icon from "@mdi/react";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import MenuFileRestore from "./menu-items/MenuFileRestore";
import MenuFileDelete from "./menu-items/MenuFileDelete";
import ModalDisplayTemplate from "./menu-items/ModalDisplayTemplate";
import ModalDeleteFile from "./menu-items/ModalDeleteFile";
import ModalRestoreFile from "./menu-items/ModalRestoreFile";

const TrashFile = ({ file }) => {
  const [modalHeader, setModalHeader] = useState(() => {
    return "Empty Header";
  });
  const [modalBody, setModalBody] = useState(() => {
    return <></>;
  });
  const context = useOutletContext();
  const { setNav } = context;
  // for file delete modal
  const {
    isOpen: isOpenDeleteModal,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal
  } = useDisclosure();
  // for file restore modal
  const {
    isOpen: isOpenRestoreModal,
    onOpen: onOpenRestoreModal,
    onClose: onCloseRestoreModal
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
            <MenuFileRestore
              file={file}
              setNav={setNav}
              onOpenRestoreModal={onOpenRestoreModal}
            />
            <MenuFileDelete
              file={file}
              setNav={setNav}
              onOpenDeleteModal={onOpenDeleteModal}
            />
          </MenuList>
        </Menu>
        <ModalRestoreFile
          isOpen={isOpenRestoreModal}
          onClose={onCloseRestoreModal}
          file={file}
          setNav={setNav}
        />
        <ModalDeleteFile
          isOpen={isOpenDeleteModal}
          onClose={onCloseDeleteModal}
          file={file}
          setNav={setNav}
        />
      </div>
    </div>
  );
};

export default TrashFile;
