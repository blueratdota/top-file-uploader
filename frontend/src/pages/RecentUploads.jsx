import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

const RecentUploads = () => {
  const context = useOutletContext();
  useEffect(() => {
    context.setCurrentPage("Recent Uploads");
  }, []);
  return <div>Recent uploads</div>;
};
export default RecentUploads;
