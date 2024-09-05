import { MenuItem } from "@chakra-ui/react";
import Icon from "@mdi/react";
import { mdiRestore } from "@mdi/js";
import { useOutletContext } from "react-router-dom";

const MenuFolderRestore = ({ setNav, onOpenRestoreModal }) => {
  return (
    <MenuItem
      onClick={() => {
        setNav(true);
        onOpenRestoreModal();
      }}
    >
      <span className="w-5 mr-2">
        <Icon path={mdiRestore} />
      </span>{" "}
      Restore
    </MenuItem>
  );
};
export default MenuFolderRestore;
