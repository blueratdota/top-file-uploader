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

const ModalRenameFolder = ({ isOpen, onClose, folder }) => {
  const [folderName, setFolderName] = useState(folder.name);
  const [isLoading, setIsLoading] = useState(false);
  const context = useOutletContext();
  const { mutateFiles, mutateFolders } = context;
  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (folderName != folder.name && folderName) {
      setIsLoading(true);
      try {
        const body = {
          id: folder.id,
          newName: folderName
        };
        const response = await fetch(
          "http://localhost:3000/api/folders/rename",
          {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          }
        );

        await mutateFiles();
        await mutateFolders();
        setFolderName("");
        setIsLoading(false);
        onClose();
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Please input folder name");
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
                context.setNav(false);
              }}
            />
          </ModalHeader>
          <ModalBody className="p-4 text-xl">
            {" "}
            <div>
              <form method="post" onSubmit={onSubmitForm}>
                <InputGroup>
                  <Input
                    required
                    type="text"
                    placeholder="Input folder name"
                    className="pb-2  text-black outline-none border-b w-full"
                    value={folderName}
                    onChange={(e) => {
                      setFolderName(e.target.value);
                    }}
                  />
                </InputGroup>
                <div className="mt-8 w-full flex gap-5 justify-center">
                  <Button
                    variant="solid"
                    className="bg-slate-300 w-[120px] py-1  text-extWhite"
                    onClick={() => {
                      setFolderName("");
                      onClose();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="solid"
                    className="bg-extGreen w-[120px] py-1  text-extWhite"
                  >
                    Rename
                  </Button>
                </div>
              </form>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ModalRenameFolder;
