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
import { useDisclosure } from "@chakra-ui/react";
import SmallIconBtn from "../SmallIconButton";
import ModalFileUpload from "./ModalFileUpload";

const NavTablet = ({ currentFolder }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div className="bg-extGreen h-[70px] right-0 w-[calc(100%-220px)] p-3 flex fixed">
      <div className="h-full basis-[30%] flex items-center">
        <img src={siteLogo} alt="" className="h-[70%] object-contain " />
      </div>
      <div className="h-full basis-[70%] flex gap-1 grow-0 items-center justify-end">
        <div className="flex items-center [&>*]:text-extWhite [&>div]:w-[46px] [&>div>svg]:scale-[0.5] ">
          <SmallIconBtn
            icon={mdiUpload}
            onClick={() => {
              console.log("open upload");
              onOpen();
            }}
          ></SmallIconBtn>
          <p>UPLOAD</p>
        </div>
        <div className="flex items-center [&>*]:text-extWhite [&>div]:w-[46px] [&>div>svg]:scale-[0.5] ">
          <SmallIconBtn
            icon={mdiSort}
            onClick={() => {
              console.log("open upload");
            }}
          ></SmallIconBtn>
          <p>SORT</p>
        </div>
        <div className="flex items-center [&>*]:text-extWhite [&>div]:w-[46px] [&>div>svg]:scale-[0.5] ">
          <SmallIconBtn
            icon={mdiFilter}
            onClick={() => {
              console.log("open upload");
            }}
          ></SmallIconBtn>
          <p>FILTER</p>
        </div>
        <div className="flex items-center [&>*]:text-extWhite [&>div]:w-[46px] [&>div>svg]:scale-[0.5] ">
          <SmallIconBtn
            icon={mdiMagnify}
            onClick={() => {
              console.log("open upload");
            }}
          ></SmallIconBtn>
        </div>
        <div className="flex items-center [&>*]:text-extWhite [&>div]:w-[46px] [&>div>svg]:scale-[0.5] ">
          <SmallIconBtn
            icon={mdiFolderPlus}
            onClick={() => {
              console.log("open upload");
            }}
          ></SmallIconBtn>
        </div>
        <div className="flex items-center [&>*]:text-extWhite [&>div]:w-[46px] [&>div>svg]:scale-[0.5] ">
          <SmallIconBtn
            icon={mdiMenu}
            onClick={() => {
              console.log("open upload");
            }}
          ></SmallIconBtn>
        </div>
      </div>
      <ModalFileUpload
        isOpen={isOpen}
        onClose={onClose}
        currentFolder={currentFolder}
      />
    </div>
  );
};
export default NavTablet;
