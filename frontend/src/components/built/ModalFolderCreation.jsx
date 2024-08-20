import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  InputGroup,
  InputLeftAddon,
  Input
} from "@chakra-ui/react";
import { useState } from "react";
import { useSWRConfig } from "swr";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
const ModalFolderCreation = ({ isOpen, onClose, currentFolder }) => {
  const [folderName, setFolderName] = useState();
  const { id } = useParams();
  const context = useOutletContext();
  const { mutate } = useSWRConfig();
  const navigate = useNavigate();
  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (folderName) {
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
          "http://localhost:3000/api/folders/create",
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          }
        );

        await mutate("http://localhost:3000/api/folders/get-all");
        navigate("/");
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
        <ModalOverlay className="bg-gray-400 bg-opacity-40 backdrop-blur" />
        <ModalContent className="absolute bg-white top-52 mx-auto">
          <ModalHeader className="bg-extGreen text-white uppercase px-2 py-1 flex justify-between items-center text-xl">
            <p>Create Folder</p>
            <ModalCloseButton />
          </ModalHeader>

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
            {/* <div className=" flex gap-4 justify-center mt-4">
              <Button className="w-20 border py-1" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="w-20 border py-1 "
                onClick={() => {
                  // function to run on yes
                  onClose();
                }}
              >
                Yes
              </Button>
            </div> */}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ModalFolderCreation;
