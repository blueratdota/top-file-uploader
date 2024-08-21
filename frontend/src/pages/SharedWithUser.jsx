import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";

const SharedWithUser = () => {
  const context = useOutletContext();
  useEffect(() => {
    context.setCurrentPage("Shared");
  }, []);
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
    </div>
  );
};
export default SharedWithUser;
