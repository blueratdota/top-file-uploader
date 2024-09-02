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
// import useSWR from "swr";
import LoadingPage from "../built/LoadingPage.jsx";

const ModalUnshareFolder = ({ isOpen, onClose, folder, setNav }) => {
  const [userName, setUsername] = useState("");
  const [queryMessage, setQueryMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUnshared, setIsUnshared] = useState(false);
  const context = useOutletContext();
  const { mutateFiles, mutateFolders, profile } = context;

  let allowed = [];
  if (folder) {
    folder.allowedUsers.forEach((user) => {
      allowed.push(user.name);
    });
  }

  const onShareFolder = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (allowed.includes(userName)) {
        setQueryMessage(`Removing access from ${userName}`);
        const body = {
          name: userName,
          folderIdToShare: folder.id
        };
        const response = await fetch(
          "http://localhost:3000/api/users//unshare-to-user",
          {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          }
        );
        setIsUnshared(true);
      } else {
        setQueryMessage("User does not exist on allowed users list");
      }
    } catch (error) {}
    setIsLoading(false);
  };

  const modalClose = () => {
    setNav(false);
    setUsername("");
    setQueryMessage("");
    onClose();
  };
  // console.log(folder);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          className="bg-gray-400 bg-opacity-40 backdrop-blur"
          onClick={() => {
            console.log("overlay clicked");

            // setNav(false);
            // onClose();
            // setUsername("");
            modalClose();
          }}
        />
        <ModalContent
          maxW={"500px"}
          maxH={"700px"}
          className="absolute bg-white top-52 mx-auto"
        >
          <ModalHeader className="bg-extGreen text-white uppercase px-2 py-1 flex justify-between items-center text-xl">
            <p>{"Unshare Folder"}</p>
            <ModalCloseButton
              onClick={() => {
                modalClose();
              }}
            />
          </ModalHeader>
          <ModalBody className="p-4 text-xl">
            {" "}
            <div>
              <form method="post" onSubmit={onShareFolder}>
                <div className="mb-3">
                  <InputGroup className="flex flex-col">
                    <label htmlFor="receiver-name" className="mb-2">
                      Remove user access of this folder
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
                  <div
                    className={`pl-3 pt-2 text-sm ${
                      queryMessage ==
                      "User does not exist on allowed users list"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {queryMessage}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Icon path={mdiFolderOutline} className="h-8" />
                  <p>
                    You are about to unshare{" "}
                    <span className="underline font-semibold">
                      {folder.name}
                    </span>
                  </p>
                </div>

                <div className="mt-8 w-full flex gap-5 justify-center">
                  {isUnshared ? (
                    <>
                      <div>{`Folder access removed from ${userName}`}</div>
                    </>
                  ) : (
                    <>
                      {isLoading ? (
                        <div>Loading...</div>
                      ) : (
                        <>
                          <Button
                            variant="solid"
                            className="bg-slate-300 w-[120px] py-1  text-extWhite"
                            onClick={() => {
                              modalClose();
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            variant="solid"
                            className="bg-red-500 w-[120px] py-1  text-extWhite"
                          >
                            Unshare
                          </Button>
                        </>
                      )}
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
export default ModalUnshareFolder;
