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

            <div className="">
              <h2>Accessible by</h2>
              <div className="flex text-sm gap-1 truncate">
                {folder.allowedUsers.map((user, index) => {
                  return (
                    <p key={user.name}>
                      {`${user.name}${index + 1 == folder.allowedUsers.length ? " " : ", "} `}
                    </p>
                  );
                })}
              </div>
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
