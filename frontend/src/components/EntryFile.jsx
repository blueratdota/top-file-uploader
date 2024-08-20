import { mdiFileOutline, mdiDotsVertical } from "@mdi/js";
import Icon from "@mdi/react";
const EntryFile = ({ file }) => {
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
          {/* <span>
            {folder.storedFiles == undefined ? 0 : folder.storedFiles.length}{" "}
            files
          </span> */}
        </div>
      </div>
      <div>
        <div>{file.fileSize} bytes</div>
        <div>{file.downloadCount} downloads</div>
      </div>

      <div className="w-10 px-2">
        <Icon path={mdiDotsVertical} className="w-full"></Icon>
      </div>
      <div></div>
    </div>
  );
};

export default EntryFile;
