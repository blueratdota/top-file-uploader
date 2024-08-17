import Icon from "@mdi/react";
const SmallIconBtn = ({ icon, onClick, ref }) => {
  return (
    <div className="flex-auto" onClick={onClick} ref={ref}>
      <Icon path={icon} />
    </div>
  );
};

export default SmallIconBtn;
