import { MenuItem, Button } from "@chakra-ui/react";
import Icon from "@mdi/react";
import { mdiCardTextOutline } from "@mdi/js";
import { useOutletContext } from "react-router-dom";
import { format } from "date-fns";

const MenuDetails = ({ setNav, onOpenDetailsModal }) => {
  return (
    <MenuItem
      onClick={() => {
        setNav(true);
        onOpenDetailsModal();
      }}
    >
      <span className="w-5 mr-2">
        <Icon path={mdiCardTextOutline} />
      </span>{" "}
      Details
    </MenuItem>
  );
};
export default MenuDetails;
