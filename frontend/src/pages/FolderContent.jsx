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
  // const folderArray = context.folders;
  // console.log(folderArray);
  // if (folderArray != undefined) {
  //   const findRes = folderArray.find((item) => item.id == id);
  //   console.log(findRes);
  // }
  // const findRes = folderArray.find((x) => {
  //   return x.id == id;
  // });
  // console.log(findRes);
  return (
    <>
      {context.isLoadingFolders || context.isLoadingFiles ? (
        <LoadingPage>Loading Folder</LoadingPage>
      ) : (
        <div className="w-full">
          {context.folders.map((folder) => {
            if (folder.parentFolderId == id) {
              return <EntryFolder key={folder.id} folder={folder} />;
            }
          })}
          {context.files.map((file) => {
            if (file.foldersId == id) {
              return <EntryFile key={file.id} file={file} />;
            }
          })}
        </div>
      )}
    </>
  );
};
export default FolderContent;
