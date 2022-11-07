import {
	Avatar,
	AvatarGroup,
	Box,
	Text,
	Button,
	ButtonGroup,
	Center,
	Divider,
	Flex,
	Spacer,
} from '@chakra-ui/react';
import { FaComments, FaTasks } from 'react-icons/fa';
import React from 'react';
import { Paper } from 'styles/Paper';
import { motion } from 'framer-motion';

const tagToColorMap = {
	design: 'cyan.500',
	develop: 'purple.300',
};

export function Task(props) {
	const { task } = props;

	return (
		<Paper
			as={motion.div}
			drag
			borderStyle="dashed"
			borderWidth="0px"
			borderColor="gray"
			whileHover={{ scale: 1.01, borderWidth: '1px' }}
			dragMomentum={false}
			dragTransition={{ bounceStiffness: 800, bounceDamping: 10 }}
			whileTap={{ scale: 0.99 }}
			w="1/3"
			display="inline-block"
			p="4"
		>
			<Text fontSize={'2xl'} textAlign="left" fontWeight="bold">
				{task.title}
				<Text fontSize="sm" fontWeight="normal" textColor="">
					DUE DATE: {task.dueDate}
				</Text>
				<Text fontSize="lg" fontWeight="normal" textColor="gray.600">
					{task.description}
				</Text>
			</Text>
			<ButtonGroup variant="solid" spacing="2" pt="2" pb="4">
				{task.tags &&
					task.tags?.map((tag) => {
						const color = tagToColorMap[tag];
						return (
							<Button
								bgColor={color}
								size="sm"
								borderRadius="full"
								key={tag}
								textTransform="uppercase"
							>
								{tag}
							</Button>
						);
					})}
			</ButtonGroup>
			<Divider borderColor="gray.400"></Divider>

			<Flex>
				<Box pt="4">
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
				<Box pt="4">
					<Center>
						<Flex pt="1px" gap="2">
							<FaComments size="24px" />
							<Text>{task.comments}</Text>
						</Flex>
					</Center>
				</Box>
			</Flex>

			<Spacer />
		</Paper>
	);
}
