import siteLogo from "../../images/site-logo-white.png";
import Icon from "@mdi/react";
import {
  mdiUpload,
  mdiSort,
  mdiMagnify,
  mdiFolderPlus,
  mdiMenu
} from "@mdi/js";
import { useDisclosure, Drawer } from "@chakra-ui/react";
import SmallIconBtn from "../SmallIconButton";
import ModalFileUpload from "./ModalFileUpload";
import ModalFolderCreation from "./ModalFolderCreation";
import { useOutletContext } from "react-router-dom";
import DrawerMenu from "./DrawerMenu";

const NavMobile = ({}) => {
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
  return (
    <>
      <div className="bg-extGreen h-[70px] w-full p-3 flex fixed">
        <div className="h-full basis-[30%] flex items-center">
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
          <SmallIconBtn
            icon={mdiSort}
            onClick={() => {
              console.log("open sort");
            }}
          ></SmallIconBtn>
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
        />
        <ModalFolderCreation
          isOpen={isOpenFolderCreateModal}
          onClose={onCloseFolderCreateModal}
          currentFolder={context.currentFolder}
        />
      </div>
      <Drawer isOpen={isOpenMenu} placement="right" onClose={onCloseMenu}>
        <DrawerMenu onClose={onCloseMenu} isOpen={isOpenMenu}></DrawerMenu>
      </Drawer>
    </>
  );
};

export default NavMobile;
