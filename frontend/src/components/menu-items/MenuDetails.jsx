import { MenuItem, Button } from "@chakra-ui/react";
import Icon from "@mdi/react";
import { mdiCardTextOutline } from "@mdi/js";
import { useOutletContext } from "react-router-dom";
import { format } from "date-fns";

const MenuDetails = ({
  folder,
  setModalHeader,
  setModalBody,
  setNav,
  onOpenModal,
  onCloseModal
}) => {
  const context = useOutletContext();
  // created/updated == 2024-08-22T19:02:08.824Z
  return (
    <MenuItem
      onClick={() => {
        console.log(folder);
        setNav(true);
        setModalHeader("Folder Details");
        setModalBody(
          <>
            <div>
              <h2>Owner</h2>
              <p className="text-sm">{folder.author.name}</p>
              <h2>Created</h2>
              <p className="text-sm">
                {format(folder.createdAt, "MM/dd/yyyy hh:mm:s a")}
              </p>
              <h2>Last Modified</h2>
              <p className="text-sm">
                {format(folder.updatedAt, "MM/dd/yyyy hh:mm:s a")}
              </p>
            </div>

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
                onClick={() => {}}
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
        <Icon path={mdiCardTextOutline} />
      </span>{" "}
      Details
    </MenuItem>
  );
};
export default MenuDetails;
