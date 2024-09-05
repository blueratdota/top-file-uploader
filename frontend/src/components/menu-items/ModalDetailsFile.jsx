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

const ModalDetailsFile = ({ isOpen, onClose, file }) => {
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
            <p>{"File Details"}</p>
            <ModalCloseButton
              onClick={() => {
                setNav(false);
              }}
            />
          </ModalHeader>
          <ModalBody className="p-4 text-xl">
            <div>
              <h2>Owner</h2>
              <p className="text-sm">{file.author.name}</p>
              <h2>Created</h2>
              <p className="text-sm">
                {format(file.createdAt, "MM/dd/yyyy hh:mm:s a")}
              </p>
              <h2>Last Modified</h2>
              <p className="text-sm">
                {format(file.updatedAt, "MM/dd/yyyy hh:mm:s a")}
              </p>
            </div>

            <div className="">
              <h2>Accessible by</h2>
              <div className="flex text-sm gap-1 truncate">
                {file.allowedUsers.length > 1
                  ? null
                  : "This file is not shared to anyone"}

                {file.allowedUsers.map((user, index) => {
                  return (
                    <p key={user.name}>
                      {`${user.name}${
                        index + 1 == file.allowedUsers.length ? " " : ", "
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
export default ModalDetailsFile;
