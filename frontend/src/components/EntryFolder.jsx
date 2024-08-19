import { mdiFolderOutline, mdiDotsVertical } from "@mdi/js";
import { Link, useOutletContext } from "react-router-dom";
import Icon from "@mdi/react";
const EntryFolder = ({ folder }) => {
  return (
    <div className="flex items-center justify-between h-11 w-full py-8 border-b">
      <Link
        className="flex items-center w-full"
        onClick={() => {}}
        to={`/home/folder/${folder.id}`}
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
      <div className="w-10 px-2">
        <Icon path={mdiDotsVertical} className="w-full"></Icon>
      </div>
      <div></div>
    </div>
  );
};

export default EntryFolder;
