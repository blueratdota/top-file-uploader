import {
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  Button
} from "@chakra-ui/react";
import SideBar from "./SideBar";

const DrawerMenu = ({ isOpen, onClose }) => {
  return (
    <>
      <DrawerOverlay
        onClick={() => {
          console.log("overlay clicked");
          onClose();
        }}
        className="backdrop-blur"
      />
      <DrawerContent className=" max-w-[220px]">
        <DrawerBody>
          <SideBar />
          yeet
        </DrawerBody>
      </DrawerContent>
    </>
  );
};

export default DrawerMenu;
