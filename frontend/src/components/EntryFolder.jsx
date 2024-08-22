import { mdiFolderOutline, mdiDotsVertical } from "@mdi/js";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useState } from "react";

import SmallIconBtn from "./SmallIconButton";
import { Link, useOutletContext } from "react-router-dom";
import Icon from "@mdi/react";

const EntryFolder = ({ folder }) => {
  const [isLoading, setIsLoading] = useState(false);
  const context = useOutletContext();
  const toTrash = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/folders/to-trash/${folder.id}/${true}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
          // body: JSON.stringify(body)
        }
      );
      await context.mutateFiles();
      await context.mutateFolders();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex items-center justify-between h-11 w-full py-8 border-b z-0">
      <Link
        className="flex items-center w-full"
        onClick={() => {}}
        to={`/home/my-files/folder/${folder.id}`}
      >
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
      </Link>
      <div className="w-11">
        <Menu>
          <MenuButton className="scale-[0.5] w-[46px] text-white">
            <SmallIconBtn icon={mdiDotsVertical}></SmallIconBtn>
          </MenuButton>
          <MenuList
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
            <MenuItem
              onClick={() => {
                console.log(folder);
                toTrash();
              }}
            >
              <span className="w-5">o</span> Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
      <div></div>
    </div>
  );
};

export default EntryFolder;
