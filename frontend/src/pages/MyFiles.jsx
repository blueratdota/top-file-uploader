import { useOutletContext } from "react-router-dom";
import EntryFolder from "../components/EntryFolder";
import EntryFile from "../components/EntryFile";
import LoadingPage from "../components/built/LoadingPage";
import useSWR from "swr";

const MyFiles = () => {
  const context = useOutletContext();
  const { sortType, sortAsc } = context;

  const isAsc = (() => {
    if (sortAsc) return "asc";
    else return "desc";
  })();

  const fetcher = (url) =>
    fetch(url, { credentials: "include" }).then((res) => res.json());
  const {
    data: folders,
    error: errorFolders,
    isLoading: isLoadingFolders
  } = useSWR(
    `http://localhost:3000/api/folders/get-all/${sortType}/${isAsc}`,
    fetcher,
    {
      revalidateOnFocus: false
    }
  );
  const {
    data: files,
    error: errorFiles,
    isLoading: isLoadingFiles
  } = useSWR(
    `http://localhost:3000/api/files/get-all/${sortType}/${isAsc}`,
    fetcher,
    {
      revalidateOnFocus: false
    }
  );
  // console.log(isLoadingFolders);

  return (
    <>
      {isLoadingFolders || isLoadingFiles ? (
        <div className="w-full h-full">
          <LoadingPage>
            <p>Loading Folders and Files</p>
          </LoadingPage>
        </div>
      ) : (
        <div className="w-full">
          {folders.map((folder) => {
            if (folder.parentFolderId == null) {
              return <EntryFolder key={folder.id} folder={folder} />;
            }
          })}
          {files.map((file) => {
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
