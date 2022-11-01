import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
} from '@chakra-ui/react';

export default function InviteTeamModal(props) {
	const { isOpen, onOpen, onClose } = props;

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Invite Team


            
          </ModalHeader>
					<ModalCloseButton />
					<ModalBody>{/* <Lorem count={2} /> */}</ModalBody>

					{/* <ModalFooter>
						<Button colorScheme="blue" mr={3} onClick={onClose}>
							Close
						</Button>
						<Button variant="ghost">Secondary Action</Button>
					</ModalFooter> */}
				</ModalContent>
			</Modal>
		</>
	);
}
