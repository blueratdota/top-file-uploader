import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import SharedFolder from "../components/SharedFolder";
import LoadingPage from "../components/built/LoadingPage";
import SharedFile from "../components/SharedFile";

const SharedWithUser = () => {
  const context = useOutletContext();
  const {
    sharedFolders,
    isLoadingSharedFolders,
    isLoadingSharedFiles,
    sharedFiles,
    profile
  } = context;
  let viewableFolders = [];
  profile.sharedFolders.forEach((folder) => {
    viewableFolders.push(folder.id);
  });
  console.log(sharedFolders, sharedFiles);
  return (
    <>
      {isLoadingSharedFolders || isLoadingSharedFiles ? (
        <LoadingPage>Loading Shared Folders</LoadingPage>
      ) : (
        <>
          {sharedFolders != undefined &&
          !sharedFolders.isError &&
          sharedFiles != undefined &&
          !sharedFiles.isError ? (
            <div className="w-full h-full">
              {sharedFolders.map((folder) => {
                if (
                  viewableFolders.includes(folder.id) &&
                  folder.inTrash == false
                ) {
                  return <SharedFolder key={folder.id} folder={folder} />;
                }
              })}
              {sharedFiles.map((file) => {
                if (file.inTrash == false) {
                  return <SharedFile key={file.id} file={file} />;
                }
              })}
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </>
      )}
    </>
  );
};
export default SharedWithUser;
