import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button
} from "@chakra-ui/react";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";

const ModalDeleteFolder = ({ isOpen, onClose, folder }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [queryMessage, setQueryMessage] = useState("");
  const context = useOutletContext();
  const { mutateFiles, mutateFolders, setNav } = context;
  const deletePermanently = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/api/folders/delete/${folder.id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
          // body: JSON.stringify(body)
        }
      );
      await mutateFiles();
      await mutateFolders();
      setIsLoading(false);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          className="bg-gray-400 bg-opacity-40 backdrop-blur"
          onClick={() => {
            context.setNav(false);
            onClose();
          }}
        />
        <ModalContent
          maxW={"500px"}
          className="absolute bg-white top-52 mx-auto"
        >
          <ModalHeader className="bg-extGreen text-white uppercase px-2 py-1 flex justify-between items-center text-xl">
            <p>{"Rename Folder"}</p>
            <ModalCloseButton
              onClick={() => {
                setNav(false);
              }}
            />
          </ModalHeader>
          <ModalBody className="p-4 text-xl">
            {" "}
            <div>
              <div>
                <p className="text-base text-justify">
                  {`Are you sure you want to delete this folder permanently? Folders and files deleted permanently cannot be recovered`}{" "}
                </p>
              </div>
              <div className="mt-8 w-full flex gap-5 justify-center">
                {isLoading ? (
                  <div>Deleting...</div>
                ) : (
                  <>
                    <Button
                      variant="solid"
                      className="bg-slate-300 w-[120px] py-1  text-extWhite"
                      onClick={() => {
                        onClose();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={deletePermanently}
                      variant="solid"
                      className="bg-red-600 w-[120px] py-1  text-extWhite"
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ModalDeleteFolder;
