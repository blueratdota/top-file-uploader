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
import SharedFolder from "../components/SharedFolder";

const SharedFolderContent = () => {
  const context = useOutletContext();
  const { profile } = context;
  const { id } = useParams();
  console.log(profile.sharedFolders);
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
        <div className="w-full ">
          {profile.sharedFolders.map((folder) => {
            if (folder.parentFolderId == id && !folder.inTrash) {
              return <SharedFolder key={folder.id} folder={folder} />;
            }
          })}
          {profile.sharedFolders.map((file) => {
            if (file.foldersId == id && !file.inTrash) {
              return <EntryFile key={file.id} file={file} />;
            }
          })}
          <div>
            this is the shared folder content -- show further children via id
          </div>
        </div>
      )}
    </>
  );
};
export default SharedFolderContent;
