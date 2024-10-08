import {
  useLocation,
  useOutletContext,
  useParams,
  useSearchParams
} from "react-router-dom";
import EntryFolder from "../components/EntryFolder";
import EntryFile from "../components/EntryFile";
import useSWR from "swr";
import LoadingPage from "../components/built/LoadingPage";

const FolderContent = () => {
  const context = useOutletContext();
  const { id } = useParams();

  return (
    <>
      {context.isLoadingFolders || context.isLoadingFiles ? (
        <LoadingPage>Loading Folder</LoadingPage>
      ) : (
        <div className="w-full ">
          {context.folders.map((folder) => {
            if (folder.parentFolderId == id && !folder.inTrash) {
              return <EntryFolder key={folder.id} folder={folder} />;
            }
          })}
          {context.files.map((file) => {
            if (file.foldersId == id && !file.inTrash) {
              return <EntryFile key={file.id} file={file} />;
            }
          })}
        </div>
      )}
    </>
  );
};
export default FolderContent;
