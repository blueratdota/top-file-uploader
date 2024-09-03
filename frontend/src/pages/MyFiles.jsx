import { useNavigate, useOutletContext } from "react-router-dom";
import EntryFolder from "../components/EntryFolder";
import EntryFile from "../components/EntryFile";
import LoadingPage from "../components/built/LoadingPage";
import useSWR from "swr";
import { useEffect } from "react";

const MyFiles = () => {
  const context = useOutletContext();
  const navigate = useNavigate();
  // console.log(context.folders);
  try {
    return (
      <>
        {context.isLoadingFolders || context.isLoadingFiles ? (
          <div className="w-full h-full">
            <LoadingPage>
              <p>Loading Folders and Files</p>
            </LoadingPage>
          </div>
        ) : (
          <div className="w-full">
            {context.folders.map((folder) => {
              if (folder.parentFolderId == null && !folder.inTrash) {
                return <EntryFolder key={folder.id} folder={folder} />;
              }
            })}
            {context.files.map((file) => {
              if (!file.foldersId && !file.inTrash) {
                return <EntryFile key={file.id} file={file} />;
              }
            })}
          </div>
        )}
      </>
    );
  } catch (error) {
    console.log(error);
    navigate("/");
  }
};
export default MyFiles;
