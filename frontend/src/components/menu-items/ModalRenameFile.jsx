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

const ModalRenameFile = ({ isOpen, onClose, file }) => {
  const [fileName, setFileName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const [queryMessage, setQueryMessage] = useState("");
  const context = useOutletContext();
  const { mutateFiles, mutateFolders, setNav } = context;
  const onSubmitForm = async (e) => {
    //put an error message
    e.preventDefault();
    if (fileName != file.name && fileName) {
      setIsLoading(true);
      try {
        const body = {
          id: file.id,
          oldName: file.name,
          newName: fileName,
          foldersId: file.foldersId
        };
        const response = await fetch("http://localhost:3000/api/files/rename", {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const result = await response.json();
        if (result.isSuccess) {
          setQueryMessage("File rename successful");
          await mutateFiles();
          await mutateFolders();
          setFileName("");
          onClose();
        } else {
          setQueryMessage("File rename unsuccessful");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Please input file name");
    }
    setIsLoading(false);
  };
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
              <form method="post" onSubmit={onSubmitForm}>
                <div>
                  <InputGroup>
                    <Input
                      required
                      type="text"
                      placeholder="Input folder name"
                      className="pb-2  text-black outline-none border-b w-full"
                      value={fileName}
                      onChange={(e) => {
                        setFileName(e.target.value);
                      }}
                    />
                  </InputGroup>
                </div>
                <div
                  className={`pl-3 pt-2 text-sm ${
                    queryMessage == "File rename successful"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {queryMessage}
                </div>
                <div className="mt-8 w-full flex gap-5 justify-center">
                  {isLoading ? (
                    <div>Loading...</div>
                  ) : (
                    <>
                      <Button
                        variant="solid"
                        className="bg-slate-300 w-[120px] py-1  text-extWhite"
                        onClick={() => {
                          setFileName("");
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
                    </>
                  )}
                </div>
              </form>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ModalRenameFile;
