import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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
  IconButton,
  Tag,
  Tooltip,
} from '@chakra-ui/react';
import { FaClock, FaComments } from 'react-icons/fa';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';

import { BiDotsVerticalRounded } from 'react-icons/bi';
import React, { useCallback } from 'react';
import { Paper } from 'components/Paper';
import { motion } from 'framer-motion';
import moment from 'moment';
import { taskController } from 'lib-client/controllers';
import { BsClock } from 'react-icons/bs';
import { DraggableWrapper } from 'components/DragNDrop';

const tagToColorMap = {
  design: 'cyan.500',
  develop: 'purple.300',
};

export function Task(props) {
  const { task, index } = props;

  const { mutateAsync: deleteTask } = taskController.useMutation('delete');
  const { mutateAsync: updateTask } = taskController.useMutation('update');

  // const Assignees = useCallback(() => {
  //   return (
  //     <AvatarGroup size="xs" max={5} alignContent="left" gap="1">
  //       {task?.assignees?.map((user) => {
  //         return (
  //           <Tooltip key={user.id} label={user.fullName}>
  //             <Avatar
  //               size="xs"
  //               borderColor="grey.50"
  //               name={user.fullName}
  //               // src={user.userIcon}
  //               loading="eager"
  //               // loading="lazy"
  //             />
  //           </Tooltip>
  //         );
  //       })}
  //     </AvatarGroup>
  //   );
  // }, []);

  const menuIcon = (
    <Menu placement="left-start" offset={[0, 0]} w="30px">
      <MenuButton as="div">
        <IconButton variant="ghost" icon={<BiDotsVerticalRounded />} />
      </MenuButton>
      <MenuList w="30px">
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

  const getTaskWithoutRelations = ({ assignees, ...task }) => ({ ...task });

  return (
    <DraggableWrapper
      id={JSON.stringify(getTaskWithoutRelations(task))}
      index={index}
      dragContainerProps={({ isDragging }) => ({
        sx: {
          borderWidth: '1px',
          borderColor: 'blackAlpha.200',
          shadow: 'sm',
          transition: 'box-shadow 1s',
          w: '100%',
          display: 'inline-block',
          px: '2.5',
          py: '2',
          positon: 'relative',
          userSelect: 'none',
          padding: 1 * 2.5,
          margin: `0 0 ${1}px 0`,
          backgroundColor: 'white',
          boxShadow: isDragging ? '0px 0px 0px 1px #3182ce' : '0px 0px 0px 0px #FFF',
        },
      })}
    >
      <Flex flexDir="column" margin={1} position="relative">
        <Box position="absolute" right="-3" top="-2">
          {menuIcon}
        </Box>

        <Text
          fontSize={'xl'}
          textAlign="left"
          textColor="gray.800"
          fontWeight="semibold"
          mb="1"
        >
          {task.title} ({task.id})
        </Text>
        <Text
          as={Flex}
          alignItems="center"
          fontSize="sm"
          fontWeight="normal"
          textColor="gray.600"
        >
          <FaClock display="inline" />
          {moment(task.dueDate).format('DD/MM/YYYY')}
        </Text>
        <Text fontSize="sm" fontWeight="normal" textColor="gray.600">
          {task.description}
        </Text>
        <Text fontSize="sm" fontWeight="normal" textColor="gray.600">
          {task.status.label}
        </Text>
      </Flex>
      <Divider borderColor="gray.400"></Divider>

      <Flex alignItems="center" py="1.5" px="1">
        <AvatarGroup size="xs" max={5} alignContent="left" gap="1">
          {task?.assignees?.map((user) => {
            return (
              <Tooltip key={user.id} label={user.fullName}>
                <Avatar
                  size="xs"
                  borderColor="grey.50"
                  name={user.fullName}
                  // src={user.userIcon}
                  loading="eager"
                  // loading="lazy"
                />
              </Tooltip>
            );
          })}
        </AvatarGroup>
        <Spacer />
        {/* <Flex pt="1px" gap="2" alignItems="center">
              <FaComments size="24px" />
              <Text>{task.comments}</Text>
            </Flex> */}
      </Flex>

      <Spacer />
    </DraggableWrapper>
  );
}
