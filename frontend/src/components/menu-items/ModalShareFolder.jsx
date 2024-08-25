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
import { mdiFolderOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const ModalShareFolder = ({ isOpen, onClose, folder }) => {
  const [userName, setUsername] = useState("");
  const [queryMessage, setQueryMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const context = useOutletContext();
  const { mutateFiles, mutateFolders } = context;

  useEffect(() => {
    let ignore = false;
    // write a function here to make an api call to verify if username exists
    // set query messsage depending on resut of api call
    // have a spinner on the left

    return () => {
      ignore = true;
    };
  }, [userName]);

  // const onSubmitForm = async (e) => {
  //   e.preventDefault();
  //   if (folderName != folder.name && folderName) {
  //     setIsLoading(true);
  //     try {
  //       const body = {
  //         id: folder.id,
  //         newName: folderName
  //       };
  //       const response = await fetch(
  //         "http://localhost:3000/api/folders/rename",
  //         {
  //           method: "PUT",
  //           credentials: "include",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify(body)
  //         }
  //       );

  //       await mutateFiles();
  //       await mutateFolders();
  //       setFolderName("");
  //       setIsLoading(false);
  //       onClose();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   } else {
  //     alert("Please input folder name");
  //   }
  // };
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
          maxH={"700px"}
          className="absolute bg-white top-52 mx-auto"
        >
          <ModalHeader className="bg-extGreen text-white uppercase px-2 py-1 flex justify-between items-center text-xl">
            <p>{"Share Folder"}</p>
            <ModalCloseButton
              onClick={() => {
                context.setNav(false);
              }}
            />
          </ModalHeader>
          <ModalBody className="p-4 text-xl">
            {" "}
            <div>
              <form method="post" onSubmit={() => {}}>
                <div>
                  <InputGroup className="flex flex-col mb-5">
                    <label htmlFor="receiver-name" className="mb-2">
                      Add users to access this folder
                    </label>
                    <Input
                      name="receiver-name"
                      required
                      type="text"
                      placeholder="Enter name here"
                      className="py-1 pl-3 text-black outline-none border-b w-full focus:outline-1 focus:outline-orange-300"
                      value={userName}
                      onChange={(e) => {
                        setUsername(e.target.value);
                      }}
                    />
                  </InputGroup>
                </div>
                <div className="flex items-center gap-4">
                  <Icon path={mdiFolderOutline} className="h-8" />
                  <p>
                    You are about to share{" "}
                    <span className="underline font-semibold">
                      {folder.name}
                    </span>
                  </p>
                </div>
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
                    Share
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
export default ModalShareFolder;
