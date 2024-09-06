import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  InputGroup,
  Input,
  Spinner
} from "@chakra-ui/react";
import { useState } from "react";
import { useSWRConfig } from "swr";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
const ModalFolderCreation = ({
  isOpen,
  onClose,
  mutateFiles,
  mutateFolders
}) => {
  const [folderName, setFolderName] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (folderName) {
      setIsLoading(true);
      try {
        const body = {
          name: folderName,
          parentFolderId: (() => {
            if (id == undefined) {
              return null;
            } else {
              return id;
            }
          })()
        };
        const response = await fetch(
          `${import.meta.env.VITE_SERVER}/api/folders/create`,
          {
            method: "POST",
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
            if (!isLoading) {
              onClose();
            }
          }}
        />
        <ModalContent
          className="absolute bg-white top-52 mx-auto"
          maxW={"500px"}
        >
          <ModalHeader className="bg-extGreen text-white uppercase px-2 py-1 flex justify-between items-center text-xl">
            <p>Create Folder</p>
            {isLoading ? null : <ModalCloseButton />}
          </ModalHeader>
          {isLoading ? (
            <ModalBody className="p-4 text-xl">
              <div className="h-[138px] flex flex-col justify-center items-center content-center mx-auto ">
                <Spinner
                  className="size-20 mx-auto text-extGray"
                  thickness="20px"
                ></Spinner>
              </div>
            </ModalBody>
          ) : (
            <ModalBody className="p-4 text-xl">
              <div>
                <form method="post" onSubmit={onSubmitForm}>
                  <InputGroup>
                    <Input
                      required
                      type="text"
                      placeholder="Input folder name"
                      className="pb-2  text-black outline-none border-b w-full"
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
                      Create
                    </Button>
                  </div>
                </form>
              </div>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
export default ModalFolderCreation;
