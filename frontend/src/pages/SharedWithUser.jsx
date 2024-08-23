import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import SharedFolder from "../components/SharedFolder";

const SharedWithUser = () => {
  const context = useOutletContext();
  const { profile } = context;
  // console.log(profile);
  return (
    <div>
      <p>files/folders shared with user</p>
      <p>map - if userid is in folders.allowedusers - display</p>
      <p>rethink later how to include files shared in a folder</p>
      <p>shared folder == share all files within the folder</p>
      <p>
        option to share stored at the ... button, with modal to display which
        users to allow
      </p>
      {profile.sharedFolders.map((folder) => {
        if (!folder.inTrash) {
          return <SharedFolder key={folder.id} folder={folder} />;
        }
      })}
    </div>
  );
};
export default SharedWithUser;
