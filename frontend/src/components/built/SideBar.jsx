import { Link, useOutletContext, useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { useCookies } from "react-cookie";
import {
  mdiFolderOutline,
  mdiClockOutline,
  mdiAccountMultipleOutline,
  mdiDeleteOutline,
  mdiContentSavePlusOutline,
  mdiCog,
  mdiLogout,
  mdiHelpCircleOutline
} from "@mdi/js";
import SmallIconBtn from "../SmallIconButton";

const SideBar = ({}) => {
  const [cookie, setCookie, removeCookie] = useCookies();
  const context = useOutletContext();
  const navigate = useNavigate();
  const logoutUser = async (e) => {
    console.log("logout clicked");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/api/users/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:5173"
          }
        }
      );
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <aside className="w-[220px] bg-extBlack text-extWhite uppercase absolute sm:fixed h-full px-2">
      <div className="flex py-4 gap-4 border-b border-gray-500 border-opacity-80">
        <div className="size-10 border rounded-[50%] bg-extWhite"></div>
        <div>
          <p>{context.profile.name}</p>
        </div>
      </div>
      <div className="py-4 border-b">
        <Link to={"my-files/?sortAsc=true&sortType=name"}>
          <div className="aside-links">
            <SmallIconBtn icon={mdiFolderOutline}></SmallIconBtn>
            <p>My Files</p>
          </div>
        </Link>
        <Link to={"recent-uploads"}>
          <div className="aside-links">
            <SmallIconBtn icon={mdiClockOutline}></SmallIconBtn>
            <p>Recent Uploads</p>
          </div>
        </Link>
        <Link to={"shared"}>
          <div className="aside-links">
            <SmallIconBtn icon={mdiAccountMultipleOutline}></SmallIconBtn>
            <p>Shared With Me</p>
          </div>
        </Link>
        <Link to={"trash"}>
          <div className="aside-links">
            <SmallIconBtn icon={mdiDeleteOutline}></SmallIconBtn>
            <p>Trash</p>
          </div>
        </Link>
      </div>
      <div className="py-4">
        <Link to={"my-folders"}>
          <div className="aside-links">
            <SmallIconBtn icon={mdiContentSavePlusOutline}></SmallIconBtn>
            <p>Add storage </p>
          </div>
        </Link>
        <Link to={"my-folders"}>
          <div className="aside-links">
            <SmallIconBtn icon={mdiCog}></SmallIconBtn>
            <p>account</p>
          </div>
        </Link>
        <Link
          onClick={async () => {
            await logoutUser();
            // window.location.reload();
          }}
        >
          <div className="aside-links">
            <SmallIconBtn icon={mdiLogout}></SmallIconBtn>
            <p>logout</p>
          </div>
        </Link>
        <Link to={"my-folders"}>
          <div className="aside-links">
            <SmallIconBtn icon={mdiHelpCircleOutline}></SmallIconBtn>
            <p>help</p>
          </div>
        </Link>
      </div>
    </aside>
  );
};
export default SideBar;
