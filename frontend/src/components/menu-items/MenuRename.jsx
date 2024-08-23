import { MenuItem, Button, InputGroup, Input, Spinner } from "@chakra-ui/react";
import Icon from "@mdi/react";
import { mdiRenameOutline } from "@mdi/js";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";

const MenuRename = ({
  folder,
  setModalHeader,
  setModalBody,
  setNav,
  onOpenRenameModal,
  onCloseRenameModal
}) => {
  const context = useOutletContext();

  return (
    <MenuItem
      onClick={() => {
        console.log(folder);
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
