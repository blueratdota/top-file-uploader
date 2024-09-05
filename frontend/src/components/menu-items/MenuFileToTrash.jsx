import { MenuItem, Button } from "@chakra-ui/react";
import Icon from "@mdi/react";
import { mdiDeleteOutline } from "@mdi/js";
const MenuFileToTrash = ({ setNav, onOpenTrashModal }) => {
  return (
    <MenuItem
      onClick={() => {
        setNav(true);
        onOpenTrashModal();
      }}
    >
      <span className="w-5 mr-2">
        <Icon className="text-red-400" path={mdiDeleteOutline} />
      </span>{" "}
      <p className="text-red-400">Move to Trash</p>
    </MenuItem>
  );
};
export default MenuFileToTrash;
