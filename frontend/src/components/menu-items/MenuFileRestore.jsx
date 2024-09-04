import { MenuItem } from "@chakra-ui/react";
import Icon from "@mdi/react";
import { mdiRestore } from "@mdi/js";
import { useOutletContext } from "react-router-dom";

const MenuFileRestore = ({ file }) => {
  const context = useOutletContext();
  const { mutateFiles, mutateFolders } = context;
  const toTrash = async (inTrash) => {
    try {
      const body = {
        id: file.id,
        name: file.name,
        foldersId: file.foldersId,
        inTrash: file.inTrash
      };
      const response = await fetch(
        "http://localhost:3000/api/folders/restore",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );
      const result = await response.json();
      if (result.isSuccess) {
        await mutateFiles();
        await mutateFolders();
        onClose();
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <MenuItem
      onClick={() => {
        console.log(folder);
        toTrash(false);
      }}
    >
      <span className="w-5 mr-2">
        <Icon path={mdiRestore} />
      </span>{" "}
      Restore
    </MenuItem>
  );
};
export default MenuFileRestore;
