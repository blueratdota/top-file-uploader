import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useOutletContext } from "react-router-dom";

const ModalDetailsFolder = ({ isOpen, onClose, folder }) => {
  const context = useOutletContext();
  const { setNav } = context;
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          className="bg-gray-400 bg-opacity-40 backdrop-blur"
          onClick={() => {
            setNav(false);
            onClose();
          }}
        />
        <ModalContent
          maxW={"500px"}
          className="absolute bg-white top-52 mx-auto"
        >
          <ModalHeader className="bg-extGreen text-white uppercase px-2 py-1 flex justify-between items-center text-xl">
            <p>{"Folder Details"}</p>
            <ModalCloseButton
              onClick={() => {
                setNav(false);
              }}
            />
          </ModalHeader>
          <ModalBody className="p-4 text-xl">
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
                {folder.allowedUsers.length > 0
                  ? null
                  : "No user is authorized to acces this folder"}

                {folder.allowedUsers.map((user, index) => {
                  return (
                    <p key={user.name}>
                      {`${user.name}${
                        index + 1 == folder.allowedUsers.length ? " " : ", "
                      } `}
                    </p>
                  );
                })}
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ModalDetailsFolder;
