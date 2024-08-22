import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import LoadingPage from "../components/built/LoadingPage";
import EntryFile from "../components/EntryFile";

const RecentUploads = () => {
  const context = useOutletContext();

  return (
    <>
      <>
        {context.isLoadingFolders || context.isLoadingFiles ? (
          <div className="w-full h-full">
            <LoadingPage>
              <p>Loading Recent Uploads</p>
            </LoadingPage>
          </div>
        ) : (
          <div className="w-full">
            {context.files.map((file) => {
              if (!file.foldersId) {
                return <EntryFile key={file.id} file={file} />;
              }
            })}
          </div>
        )}
      </>
    </>
  );
};
export default RecentUploads;
