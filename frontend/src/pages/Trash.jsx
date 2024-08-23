import { useNavigate, useOutletContext } from "react-router-dom";
// import EntryFolder from "../components/EntryFolder";
// import EntryFile from "../components/EntryFile";
import LoadingPage from "../components/built/LoadingPage";
import TrashFolder from "../components/TrashFolder";
import TrashFile from "../components/TrashFile";
const Trash = () => {
  const context = useOutletContext();
  return (
    // <div>
    //   <p>
    //     all files deleted, stored here, create additional column for DB
    //     isDeleted:true/false
    //   </p>
    //   <p>
    //     create column timestamp since date deleted, date deleted - current date
    //     if over 30 days delete the file
    //   </p>
    // </div>
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
            if (folder.inTrash && !folder.isDeleted) {
              return <TrashFolder key={folder.id} folder={folder} />;
            }
          })}
          {context.files.map((file) => {
            if (!file.foldersId && file.inTrash && !file.isDeleted) {
              return <TrashFile key={file.id} file={file} />;
            }
          })}
        </div>
      )}
    </>
  );
};
export default Trash;
