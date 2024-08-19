import { useOutletContext } from "react-router-dom";
import EntryFolder from "../components/EntryFolder";
import EntryFile from "../components/EntryFile";

const MyFiles = () => {
  const context = useOutletContext();
  console.log(context.profile);

  return (
    <div className="w-full">
      {context.profile.ownedFolders.map((folder) => {
        if (folder.parentFolderId == null) {
          return <EntryFolder key={folder.id} folder={folder} />;
        }
      })}
      {context.profile.Files.map((file) => {
        if (!file.foldersId) {
          return <EntryFile key={file.id} file={file} />;
        }
      })}
    </div>
  );
};
export default MyFiles;
