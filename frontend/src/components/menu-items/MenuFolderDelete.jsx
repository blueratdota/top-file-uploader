import { MenuItem, Button } from "@chakra-ui/react";
import Icon from "@mdi/react";
import { mdiDeleteOutline } from "@mdi/js";
import { useOutletContext } from "react-router-dom";

const MenuFolderToTrash = ({
  folder,
  setModalHeader,
  setModalBody,
  setNav,
  onOpenModal,
  onCloseModal
}) => {
  const context = useOutletContext();
  const deletePermanently = async (isDeleted) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/folders/to-deleted/${folder.id}/${isDeleted}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
          // body: JSON.stringify(body)
        }
      );
      await context.mutateFiles();
      await context.mutateFolders();
      onCloseModal();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <MenuItem
      onClick={() => {
        console.log(folder);
        setNav(true);
        setModalHeader("Permanently Delete Folder");
        setModalBody(
          <>
            <p className="text-base text-justify">
              {`Are you sure you want to delete this folder permanently? Folders and files deleted permanently cannot be recovered`}{" "}
            </p>
            {/* <p className="text-sm">
            {`Folders and files stored at the trash will be automatically deleted permanently after 30 days`}{" "}
          </p> */}
            <div className="mt-8 w-full flex gap-5 justify-center">
              <Button
                variant="solid"
                className="bg-slate-300 w-[120px] py-1  text-extWhite"
                onClick={() => {
                  onCloseModal();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="solid"
                className="bg-red-500 w-[120px] py-1  text-extWhite"
                onClick={() => {
                  deletePermanently(true);
                }}
              >
                Delete
              </Button>
            </div>
          </>
        );
        onOpenModal();
      }}
    >
      <span className="w-5 mr-2">
        <Icon className="text-red-600" path={mdiDeleteOutline} />
      </span>{" "}
      <p className="text-red-600">Delete Permanently</p>
    </MenuItem>
  );
};

export default MenuFolderToTrash;
