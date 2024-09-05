import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  InputGroup,
  Input,
  Button
} from "@chakra-ui/react";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";

const ModalRestoreFolder = ({ isOpen, onClose, folder }) => {
  const [isLoading, setIsLoading] = useState(false);
  const context = useOutletContext();
  const { mutateFiles, mutateFolders, setNav } = context;
  const retoreFolder = async () => {
    try {
      const body = {
        id: folder.id,
        name: folder.name,
        destinationFolderId: folder.parentFolderId,
        parentFolderId: folder.parentFolderId,
        inTrash: folder.inTrash
      };
      setIsLoading(true);
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
        setIsLoading(true);
        onClose();
      } else {
      }
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
            onCloseModal();
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
                  {`If this folder's destination folder doesn't exists, it will be restored on the root folder.`}{" "}
                </p>
              </div>
              <div className="mt-8 w-full flex gap-5 justify-center">
                {isLoading ? (
                  <div>Restoring...</div>
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
                      onClick={retoreFolder}
                      variant="solid"
                      className="bg-green-600 w-[120px] py-1  text-extWhite"
                    >
                      Restore
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
export default ModalRestoreFolder;
