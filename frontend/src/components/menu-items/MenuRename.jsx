import { MenuItem, Button, InputGroup, Input, Spinner } from "@chakra-ui/react";
import Icon from "@mdi/react";
import { mdiRenameOutline } from "@mdi/js";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";

const MenuRename = ({ setNav, onOpenRenameModal }) => {
  const context = useOutletContext();
  return (
    <MenuItem
      onClick={() => {
        setNav(true);
        onOpenRenameModal();
      }}
    >
      <span className="w-5 mr-2">
        <Icon path={mdiRenameOutline} />
      </span>{" "}
      <p>Rename Folder</p>
    </MenuItem>
  );
};
export default MenuRename;
