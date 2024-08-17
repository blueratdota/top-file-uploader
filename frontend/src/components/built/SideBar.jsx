import { useOutletContext } from "react-router-dom";
const SideBar = () => {
  const context = useOutletContext();
  return (
    <aside className="w-[220px] bg-extBlack text-extWhite fixed h-full">
      <div>
        <div>circle for picture</div>
        <div>{context.profile.name}</div>
      </div>
      <div>
        <div>my all files</div>
        <div>most recent uploads</div>
        <div>shared with me</div>
        <div>trash</div>
      </div>
      <div>
        <div>my all files</div>
        <div>most recent uploads</div>
        <div>shared with me</div>
        <div>trash</div>
      </div>
    </aside>
  );
};
export default SideBar;
