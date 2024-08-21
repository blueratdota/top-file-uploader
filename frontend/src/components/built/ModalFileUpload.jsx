import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  InputGroup,
  InputLeftAddon,
  Input,
  Text
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import { useSWRConfig } from "swr";
const ModalFileUpload = ({ isOpen, onClose, mutateFiles, mutateFolders }) => {
  const [upFile, setUpFile] = useState();
  const context = useOutletContext();
  const { id } = useParams();
  const { mutate } = useSWRConfig();
  const navigate = useNavigate();

  // do some error handling here. show in modal message do not close the modal
  const onSubmitForm = async (e) => {
    console.log(id);
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", upFile);
    if (id != undefined) {
      formData.append("foldersId", id);
    }
    try {
      const response = await fetch("http://localhost:3000/api/files/upload", {
        credentials: "include",
        mode: "cors",
        method: "POST",
        body: formData
      });
      console.log("response", response);
      console.log(...formData);
      await mutateFiles();
      await mutateFolders();

      setUpFile(null);
      onClose();
    } catch (error) {}
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          className="bg-gray-400 bg-opacity-40 backdrop-blur"
          onClick={onClose}
        />
        <ModalContent className=" bg-white top-52 mx-auto" maxW={"500px"}>
          <ModalHeader className="bg-extGreen text-white uppercase px-2 py-1 flex justify-between items-center text-xl">
            <p>File Upload</p>
            <ModalCloseButton />
          </ModalHeader>

          <ModalBody className="p-4 text-xl  ">
            <div>
              <form
                method="post"
                onSubmit={onSubmitForm}
                encType="multipart/form-data"
              >
                <InputGroup className="flex flex-col">
                  <Input
                    required
                    type="file"
                    placeholder="filename.txt"
                    className=" text-black border text-sm file:text-sm file:text-extWhite file:bg-extGreen file:border-0 file:p-2 file:mr-3"
                    onChange={(e) => {
                      setUpFile(e.target.files[0]);
                    }}
                  />
                </InputGroup>
                <div className="mt-8 w-full flex gap-5 justify-center">
                  <Button
                    variant="solid"
                    className="bg-slate-300 w-[120px] py-1  text-extWhite"
                    onClick={() => {
                      setUpFile();
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
                    Upload
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
export default ModalFileUpload;
