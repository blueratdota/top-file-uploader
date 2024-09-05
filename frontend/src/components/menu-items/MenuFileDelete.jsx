import { MenuItem, Button } from "@chakra-ui/react";
import Icon from "@mdi/react";
import { mdiDeleteOutline } from "@mdi/js";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";

const MenuFileDelete = ({ setNav, onOpenDeleteModal }) => {
  const context = useOutletContext();

  return (
    <MenuItem
      onClick={() => {
        setNav(true);
        onOpenDeleteModal();
      }}
    >
      <span className="w-5 mr-2">
        <Icon className="text-red-600" path={mdiDeleteOutline} />
      </span>{" "}
      <p className="text-red-600">Delete Permanently</p>
    </MenuItem>
  );
};

export default MenuFileDelete;
