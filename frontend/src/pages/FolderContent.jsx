import { useOutletContext, useParams } from "react-router-dom";
import EntryFolder from "../components/EntryFolder";
import EntryFile from "../components/EntryFile";
import useSWR from "swr";
import LoadingPage from "../components/built/LoadingPage";

const FolderContent = () => {
  const context = useOutletContext();
  const { id } = useParams();

  const fetcher = (url) =>
    fetch(url, {
      credentials: "include"
    }).then((res) => res.json());
  const {
    data: folderContent,
    error: errorFolderContent,
    isLoading: isLoadingFolderContent
  } = useSWR(`http://localhost:3000/api/folders/get/${id}`, fetcher, {
    revalidateOnFocus: false
  });

  console.log("swr", folderContent);

  return (
    <>
      {isLoadingFolderContent ? (
        <LoadingPage></LoadingPage>
      ) : (
        <div className="w-full">
          {folderContent.map((folder) => {
            if (folder.parentFolderId == id) {
              return <EntryFolder key={folder.id} folder={folder} />;
            }
          })}
          {/* {context.profile.Files.map((file) => {
        if (!file.foldersId) {
          return <EntryFile key={file.id} file={file} />;
        }
      })} */}
        </div>
      )}
    </>
  );
};
export default FolderContent;
