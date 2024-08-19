import { useOutletContext } from "react-router-dom";
import EntryFolder from "../components/EntryFolder";
import EntryFile from "../components/EntryFile";
import LoadingPage from "../components/built/LoadingPage";
import useSWR from "swr";

const MyFiles = () => {
  const context = useOutletContext();

  const fetcher = (url) =>
    fetch(url, { credentials: "include" }).then((res) => res.json());
  const {
    data: folders,
    error: errorFolders,
    isLoading: isLoadingFolders
  } = useSWR("http://localhost:3000/api/folders/get-all", fetcher, {
    revalidateOnFocus: false
  });
  console.log(isLoadingFolders);

  return (
    <>
      {isLoadingFolders ? (
        <LoadingPage></LoadingPage>
      ) : (
        <div className="w-full">
          {folders.map((folder) => {
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
      )}
    </>
  );
};
export default MyFiles;
