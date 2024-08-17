import siteLogo from "../../images/site-logo-white.png";
import Icon from "@mdi/react";
import {
  mdiUpload,
  mdiSort,
  mdiMagnify,
  mdiFolderPlus,
  mdiMenu
} from "@mdi/js";
import SmallIconBtn from "../SmallIconButton";

const NavMobile = () => {
  return (
    <div className="bg-extGreen h-[70px] w-full p-3 flex fixed">
      <div className="h-full basis-[30%] flex items-center">
        <img src={siteLogo} alt="" className="h-[70%] object-contain " />
      </div>
      <div className="h-full basis-[70%] flex gap-1 grow-0 items-center [&>div>svg]:text-white [&>div>svg]:scale-[0.5] [&>div]:w-[46px] [&>div]:grow-0 justify-end">
        <SmallIconBtn
          icon={mdiUpload}
          onClick={() => {
            console.log("open upload");
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
          }}
        ></SmallIconBtn>
        <SmallIconBtn
          icon={mdiMenu}
          onClick={() => {
            console.log("open menu");
          }}
        ></SmallIconBtn>
      </div>
    </div>
  );
};

export default NavMobile;
