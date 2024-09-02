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
  const context = useOutletContext();
  const { mutateFiles, mutateFolders, folders } = context;
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 640px)" });

  let paths = [];
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
          maxW={"690px"}
          className="absolute bg-white top-52 mx-auto"
        >
          <ModalHeader className="bg-extGreen text-white uppercase px-2 py-1 flex justify-between items-center text-xl">
            <p>{`Move ${folder.name}`}</p>
            <ModalCloseButton
              onClick={() => {
                context.setNav(false);
              }}
            />
          </ModalHeader>
          <ModalBody className="p-4 text-xl">
            <div className="flex items-center">
              <p>Current location:</p>
              <div className="ml-2">{folder.name}</div>
            </div>

            <div className="border py-2 my-2 min-h-24">
              {folders.map((f) => {
                if (f.parentFolderId == currFolder) {
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
              })}
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
              {paths.map((path) => {
                return (
                  <BreadcrumbItem
                    onClick={() => {
                      setCurrFolder(path.id);
                    }}
                  >
                    <BreadcrumbLink>{path.name}</BreadcrumbLink>
                  </BreadcrumbItem>
                );
              })}
            </Breadcrumb>
            <div className="mt-3 w-full flex gap-5 justify-center">
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
                type="submit"
                variant="solid"
                className="bg-extGreen w-[120px] py-1  text-extWhite"
                onClick={() => {
                  console.log(currFolder);
                }}
              >
                Rename
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ModalMoveFolder;
