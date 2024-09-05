import { mdiFileOutline, mdiDotsVertical } from "@mdi/js";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import SmallIconBtn from "./SmallIconButton";
import Icon from "@mdi/react";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import ModalDisplayTemplate from "./menu-items/ModalDisplayTemplate";
import MenuFileToTrash from "./menu-items/MenuFileToTrash";
import ModalToTrashFile from "./menu-items/ModalToTrashFile";
const EntryFile = ({ file }) => {
  const [modalHeader, setModalHeader] = useState(() => {
    return "Empty Header";
  });
  const [modalBody, setModalBody] = useState(() => {
    return <></>;
  });
  const context = useOutletContext();
  // for fixing navbar z-index issues
  const { setNav } = context;
  // FILE TEMPLATE MODAL
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal
  } = useDisclosure();
  // FILE TO-TRASH MODAL
  const {
    isOpen: isOpenTrashModal,
    onOpen: onOpenTrashModal,
    onClose: onCloseTrashModal
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
          <MenuButton className="scale-[0.5] w-[46px] text-white z-0">
            <SmallIconBtn
              icon={mdiDotsVertical}
              onClick={() => {
                console.log("open sort");
              }}
            ></SmallIconBtn>
          </MenuButton>
          <MenuList
            gap={10}
            zIndex={9999}
            className="bg-extGray text-extWhite p-2 pr-7 border border-gray-200 border-opacity-20 [&>button]:py-0.5"
          >
            <MenuItem>
              <span className="w-5">o</span> Share
            </MenuItem>
            <MenuItem>
              <span className="w-5">o</span> Copy Link
            </MenuItem>
            <MenuItem>
              <span className="w-5">o</span> Download
            </MenuItem>
            <MenuItem>
              <span className="w-5">o</span> Move to...
            </MenuItem>
            <MenuItem>
              <span className="w-5">o</span> Copy to...
            </MenuItem>
            <MenuItem>
              <span className="w-5">o</span> Rename
            </MenuItem>
            <MenuItem>
              <span className="w-5">o</span> Details
            </MenuItem>
            <MenuItem>
              <span className="w-5">o</span> Delete
            </MenuItem>
            <MenuFileToTrash
              file={file}
              setNav={setNav}
              onOpenTrashModal={onOpenTrashModal}
            />
          </MenuList>
        </Menu>
        <ModalDisplayTemplate
          isOpen={isOpenModal}
          onClose={onCloseModal}
          setNav={setNav}
          modalHeader={modalHeader}
          modalBody={modalBody}
        />
        <ModalToTrashFile
          isOpen={isOpenTrashModal}
          onClose={onCloseTrashModal}
          file={file}
          setNav={setNav}
        />
      </div>
    </div>
  );
};

export default EntryFile;
