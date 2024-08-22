import { MenuItem } from "@chakra-ui/react";
import Icon from "@mdi/react";
import { mdiDeleteOutline } from "@mdi/js";
import { useOutletContext } from "react-router-dom";

const MenuFolderDelete = ({ folder }) => {
  const context = useOutletContext();
  const toTrash = async (inTrash) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/folders/to-trash/${folder.id}/${inTrash}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
          // body: JSON.stringify(body)
        }
      );
      await context.mutateFiles();
      await context.mutateFolders();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <MenuItem
      onClick={() => {
        console.log(folder);
        toTrash(true);
      }}
    >
      <span className="w-5 mr-2">
        <Icon path={mdiDeleteOutline} />
      </span>{" "}
      Delete
    </MenuItem>
  );
};
export default MenuFolderDelete;
