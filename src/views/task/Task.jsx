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
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { FaComments } from 'react-icons/fa';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';

import { BiDotsVerticalRounded } from 'react-icons/bi';
import React from 'react';
import { Paper } from 'components/Paper';
import { motion } from 'framer-motion';
import moment from 'moment';
import { taskController } from 'lib-client/controllers';

const tagToColorMap = {
  design: 'cyan.500',
  develop: 'purple.300',
};

export function Task(props) {
  const { task } = props;

  const { mutateAsync: deleteTask } = taskController.useMutation('delete');
  const { mutateAsync: updateTask } = taskController.useMutation('update');

  const avatarGroup = (
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
  );

  const menuIcon = (
    <Menu placement="left-start">
      <MenuButton>
        <BiDotsVerticalRounded />
      </MenuButton>
      <MenuList>
        <MenuItem>
          <AiFillEdit />
          <Text pl="4px">Edit</Text>
        </MenuItem>
        <MenuItem onClick={() => deleteTask({ id: task.id })}>
          <AiFillDelete />
          <Text pl="4px">Delete</Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );

  const tags = (
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
  );

  return (
    <Paper
      as={motion.div}
      drag
      // borderStyle="dashed"
      borderWidth="0px"
      borderColor="gray"
      whileHover={{ scale: 1.01, borderWidth: '1px' }}
      dragMomentum={false}
      // dragTransition={{ bounceStiffness: 800, bounceDamping: 10 }}
      // whileTap={{ scale: 0.99 }}
      w="1/3"
      display="inline-block"
      // p="4"
    >
      <Flex flexDir="column">
        <Box pt="4"></Box>
        {avatarGroup}
        <Text fontSize={'2xl'} textAlign="left" fontWeight="bold">
          {task.title}
        </Text>
      </Flex>
      <Text fontSize="sm" fontWeight="normal" textColor="">
        DUE DATE: {moment(task.dueDate).format('DD/MM/YYYY')}
      </Text>
      <Text fontSize="lg" fontWeight="normal" textColor="gray.600">
        {task.description}
      </Text>

      <Divider borderColor="gray.400"></Divider>

      <Flex>
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
