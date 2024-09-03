import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  InputGroup,
  Input,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useMediaQuery } from "react-responsive";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiFolderAlertOutline, mdiFolderOutline } from "@mdi/js";

const ModalMoveFolder = ({ isOpen, onClose, folder }) => {
  const [currFolder, setCurrFolder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [queryMessage, setQueryMessage] = useState("");
  const context = useOutletContext();
  const { mutateFiles, mutateFolders, folders } = context;
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 640px)" });

  let paths = [];
  let displayableFolders = 0;
  const genPath = (folderId) => {
    if (folderId == null) {
      return;
    } else {
      const findParent = folders.find((f) => {
        return f.id == folderId;
      });
      if (!findParent.parentFolderId) {
        paths.unshift(findParent);
        return;
      } else {
        paths.unshift(findParent);
        genPath(findParent.parentFolderId);
      }
    }
  };
  genPath(currFolder);
  const displayArr = folders.map((f) => {
    if (f.parentFolderId == currFolder) {
      if (f.id == folder.id) {
        displayableFolders++;
        return (
          <div key={f.id} className="flex items-center mb-2">
            <div className="w-8 px-1">
              <Icon path={mdiFolderOutline} className="w-full" />
            </div>
            <div className="text-sm text-gray-500">{f.name}</div>
          </div>
        );
      } else {
        displayableFolders++;
        return (
          <div
            key={f.id}
            onClick={() => {
              setCurrFolder(f.id);
            }}
            className="flex items-center mb-2"
          >
            <div className="w-8 px-1">
              <Icon path={mdiFolderOutline} className="w-full" />
            </div>
            <div className="text-sm">{f.name}</div>
          </div>
        );
      }
    }
  });
  const onMoveFolder = async (e) => {
    setIsLoading(true);
    try {
      const body = {
        id: folder.id,
        name: folder.name,
        newParentFolderId: currFolder
      };
      const response = await fetch("http://localhost:3000/api/folders/move", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const result = await response.json();
      if (result.isSuccess) {
        setQueryMessage(result.msg);
        await mutateFiles();
        await mutateFolders();
        setCurrFolder(null);
        onClose();
      } else {
        setQueryMessage(result.msg);
      }
    } catch (error) {
      console.log("this would execute");
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          className="bg-gray-400 bg-opacity-40 backdrop-blur"
          onClick={() => {
            context.setNav(false);
            setCurrFolder(null);
            onCloseModal();
          }}
        />
        <ModalContent
          maxW={"690px"}
          className="absolute bg-white top-52 mx-auto"
        >
          <ModalHeader className="bg-extGreen text-white uppercase px-2 py-1 flex justify-between items-center text-xl">
            <p>{`Move ${folder.name}`}</p>
            <ModalCloseButton
              onClick={() => {
                context.setNav(false);
                setCurrFolder(null);
              }}
            />
          </ModalHeader>
          <ModalBody className="p-4 text-xl">
            <div className="flex items-center">
              <p>Current location:</p>
              <div className="ml-2">{folder.name}</div>
            </div>

            <div className="border-y py-2 my-2 min-h-24">
              {displayableFolders > 0 ? (
                displayArr
              ) : (
                <p className="text-sm text-center">This folder is empty</p>
              )}
            </div>
            <div
              className={`pl-3 pt-2 text-sm ${
                queryMessage == "Folder move successful"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {queryMessage}
            </div>
            <Breadcrumb
              spacing="8px"
              separator={<ChevronRightIcon color="gray.500" />}
              className="my-auto text-extBlack py-2 sm:text-sm"
            >
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => {
                    setCurrFolder(null);
                  }}
                >
                  Root
                </BreadcrumbLink>
              </BreadcrumbItem>
              {paths.map((path, index) => {
                let L = paths.length;
                let maxL = isTabletOrMobile ? L - 2 : L - 3;
                if (index >= maxL) {
                  return (
                    <BreadcrumbItem
                      key={path.id}
                      onClick={() => {
                        setCurrFolder(path.id);
                      }}
                    >
                      <BreadcrumbLink>{path.name}</BreadcrumbLink>
                    </BreadcrumbItem>
                  );
                }
              })}
            </Breadcrumb>
            <div className="mt-3 w-full flex gap-5 justify-center">
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <>
                  <Button
                    variant="solid"
                    className="bg-slate-300 w-[120px] py-1  text-extWhite"
                    onClick={() => {
                      onClose();
                      setCurrFolder(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="solid"
                    className="bg-extGreen w-[120px] py-1  text-extWhite"
                    onClick={onMoveFolder}
                  >
                    Move
                  </Button>
                </>
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ModalMoveFolder;
