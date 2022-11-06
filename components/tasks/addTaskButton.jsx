import React from 'react';
const {
  Flex,
  Button,
  HStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} = require('@chakra-ui/react');
const { CiSquarePlus } = require('react-icons/ci');

function AddTask() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      w="1/3"
      boxShadow="xs"
      p="2"
      rounded="md"
      bg="gray.50"
      border="1px"
      borderColor="gray.400"
      justifyContent="center"
      alignContent="center"
      verticalAlign="center"
    >
      <Button colorScheme="teal" variant="link" onClick={onOpen}>
        <HStack spacing="8px" align="center">
          <CiSquarePlus size="32px" />
          <Text
            fontSize={'lg'}
            textAlign="center"
            verticalAlign="1px"
            textTransform="uppercase"
          >
            Add Task
          </Text>
        </HStack>
      </Button>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Title</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
