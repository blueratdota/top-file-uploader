import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody
} from "@chakra-ui/react";

const ModalDisplayTemplate = ({
  isOpen,
  onClose,
  setNav,
  modalHeader,
  modalBody
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay
        className="bg-gray-400 bg-opacity-40 backdrop-blur"
        onClick={() => {
          setNav(false);
          onClose();
        }}
      />
      <ModalContent maxW={"500px"} className="absolute bg-white top-52 mx-auto">
        <ModalHeader className="bg-extGreen text-white uppercase px-2 py-1 flex justify-between items-center text-xl">
          <p>{modalHeader}</p>
          <ModalCloseButton
            onClick={() => {
              setNav(false);
            }}
          />
        </ModalHeader>
        <ModalBody className="p-4 text-xl">{modalBody}</ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default ModalDisplayTemplate;
