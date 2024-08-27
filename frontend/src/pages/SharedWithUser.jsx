import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import SharedFolder from "../components/SharedFolder";
import LoadingPage from "../components/built/LoadingPage";

const SharedWithUser = () => {
  const context = useOutletContext();
  const { sharedFolders, isLoadingSharedFolders, profile } = context;
  let viewableFolders = [];
  profile.sharedFolders.forEach((folder) => {
    viewableFolders.push(folder.id);
  });
  console.log(sharedFolders);
  return (
    <>
      {isLoadingSharedFolders ? (
        <LoadingPage>Loading Shared Folders</LoadingPage>
      ) : (
        <div className="w-full h-full">
          {sharedFolders.map((folder) => {
            if (viewableFolders.includes(folder.id)) {
              return <SharedFolder key={folder.id} folder={folder} />;
            }
          })}
        </div>
      )}
    </>
  );
};
export default SharedWithUser;
