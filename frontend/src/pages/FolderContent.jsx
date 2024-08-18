import { useOutletContext, useParams } from "react-router-dom";
import EntryFolder from "../components/EntryFolder";
import EntryFile from "../components/EntryFile";
const FolderContent = () => {
  const context = useOutletContext();
  const { id } = useParams();

  return <div>folder content {id}</div>;
};
export default FolderContent;
