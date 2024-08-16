import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const context = useOutletContext();
  useEffect(() => {
    if (!context.profile) {
      console.log("no logged in account");
      navigate("/login");
    }
  });
  console.log(context.profile);
  return <div>home page</div>;
};
export default HomePage;
