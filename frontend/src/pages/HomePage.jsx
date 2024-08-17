import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import NavMobile from "../components/built/NavMobileHead.jsx";
import SideBar from "../components/built/SideBar.jsx";
import NavTablet from "../components/built/NavTabletHeader.jsx";

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

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 640px)" });

  return (
    <div className="sm:flex">
      {isTabletOrMobile ? null : <SideBar />}
      <main className="w-full">
        <nav>
          {isTabletOrMobile ? <NavMobile></NavMobile> : <NavTablet></NavTablet>}
        </nav>
        <div className="pt-[70px] sm:pl-[220px] bg-extGray text-extWhite overflow-auto">
          <div>sampledata 1</div>
          <div>sampledata2</div>
          <div>sampledata3</div>
          <div>sampledata4</div>
          <div>sampledata5</div>
          <div>sampledata6</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>

          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>

          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
          <div>sampledata</div>
        </div>
      </main>
    </div>
  );
};
export default HomePage;
