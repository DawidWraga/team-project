import {
	Avatar,
	AvatarGroup,
	Box,
	Button,
	ButtonGroup,
	Center,
	Circle,
	Divider,
	Flex,
	Grid,
	Heading,
	HStack,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Spacer,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import { CiSquarePlus } from 'react-icons/ci';
import { FaComments } from 'react-icons/fa';

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

function AddTaskCol() {
	return (
		<Grid direction="column" templateColumns="repeat(3, 1fr)" gap={6} m={4}>
			<AddTask />
			<AddTask />
			<AddTask />
		</Grid>
	);
}

function ProgressTask() {
	return (
		<Box w="1/3" h="10">
			<Flex>
				<Text p={4} pt={0} pl="0" fontSize={'lg'}>
					🔴 New Requests
				</Text>
				<Spacer />
				<Text p={4} pt={0} pr="1">
					4
				</Text>
			</Flex>
			<Divider borderColor="gray.400"></Divider>
		</Box>
	);
}

function ProgressTaskCol() {
	return (
		<Grid direction="column" templateColumns="repeat(3, 1fr)" gap={6} m={4}>
			<ProgressTask />
			<ProgressTask />
			<ProgressTask />
		</Grid>
	);
}

function TaskHeader() {
	return (
		<Heading>
			<Center pt={4}>Tasks</Center>
		</Heading>
	);
}

function TaskBox() {
	return (
		<Box p="4" pb="0" w="1/3" bg="gray.100" border="1px" borderRadius="md">
			<Text fontSize={'xl'} textAlign="left" fontWeight="bold">
				Task Title
				<Text fontSize="md" fontWeight="normal" textColor="gray.600">
					Task description will go here and will explain what this task
					involves.
				</Text>
			</Text>
			<ButtonGroup variant="solid" spacing="2" pt="2" pb="4">
				<Button colorScheme="blue" size="sm" borderRadius="full">
					Tag 1
				</Button>
				<Button size="sm" colorScheme="teal" borderRadius="full">
					Tag 2
				</Button>
			</ButtonGroup>
			<Divider borderColor="gray.400"></Divider>

			<Flex>
				<Box p="2">
					<AvatarGroup size="sm" max={2} alignContent="left" gap="1">
						<Avatar
							borderColor="grey.50"
							name="Ryan Florence"
							src="https://bit.ly/ryan-florence"
							loading="lazy"
						/>
						<Avatar
							borderColor="grey.50"
							name="Segun Adebayo"
							src="https://bit.ly/sage-adebayo"
							loading="lazy"
						/>
						<Avatar
							borderColor="grey.50"
							name="Kent Dodds"
							src="https://bit.ly/kent-c-dodds"
							loading="lazy"
						/>
					</AvatarGroup>
				</Box>
				<Spacer />
				<Box p="2">
					<Center>
						<Flex pt="1px" gap="2">
							<FaComments size="24px" />
							<Text>14</Text>
						</Flex>
					</Center>
				</Box>
			</Flex>

			<Spacer />
		</Box>
	);
}

function TaskBoxCol() {
	return (
		<Grid direction="column" templateColumns="repeat(3, 1fr)" gap={6} m={4}>
			<TaskBox />
			<TaskBox />
			<TaskBox />
		</Grid>
	);
}

export default function ProjectKanbanPage(props) {
	const {} = props;
	return (
		<Box display="grid">
			<TaskHeader />
			<ProgressTaskCol />
			<AddTaskCol />
			<TaskBoxCol />
		</Box>
	);
}
