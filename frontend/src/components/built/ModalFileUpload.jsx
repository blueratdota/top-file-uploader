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
  Input
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
const ModalFileUpload = ({ isOpen, onClose }) => {
  const [upFile, setUpFile] = useState();
  const context = useOutletContext();
  const onSubmitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", upFile);
    formData.append("folder", context.currentFolder);
    try {
      console.log(formData);
      const response = await fetch("http://localhost:3000/api/files/upload", {
        credentials: "include",
        mode: "cors",
        method: "POST",
        body: formData
      });
      console.log(response);
      //   console.log(formData.file);
      //   console.log(formData.folder);
    } catch (error) {}
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay className="bg-gray-400 bg-opacity-40 backdrop-blur" />
        <ModalContent className="absolute bg-white top-52 mx-auto">
          <ModalHeader className="bg-extGreen text-white uppercase px-2 py-1 flex justify-between items-center text-xl">
            <p>File Upload</p>
            <ModalCloseButton />
          </ModalHeader>

          <ModalBody className="p-4 text-xl">
            <div>
              <form
                method="post"
                onSubmit={onSubmitForm}
                encType="multipart/form-data"
              >
                <InputGroup>
                  <InputLeftAddon className="bg-extGreen py-1 px-2 text-center">
                    <p className="w-[80px]">File</p>
                  </InputLeftAddon>
                  <Input
                    type="file"
                    placeholder="filename.txt"
                    className="pl-3  text-black outline-none"
                    onChange={(e) => {
                      setUpFile(e.target.files[0]);
                    }}
                  />
                </InputGroup>
                <Button
                  type="submit"
                  variant="solid"
                  className="bg-extGreen w-[150px] py-2 mx-auto"
                >
                  Upload
                </Button>
              </form>
            </div>
            <div className=" flex gap-4 justify-center mt-4">
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
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ModalFileUpload;
