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

const tagToColorMap = {
  design: 'cyan.500',
  develop: 'purple.300',
};

export function Task(props) {
  const { task, index } = props;

  const { mutateAsync: deleteTask } = taskController.useMutation('delete');
  const { mutateAsync: updateTask } = taskController.useMutation('update');

  const Assignees = useCallback(() => {
    return (
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
    );
  }, []);

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

  // const [avatarMax,setAvatarMax] = useState(3)

  const getTaskWithoutRelations = ({ assignees, ...task }) => ({ ...task });

  return (
    <Draggable
      key={task.id}
      draggableId={JSON.stringify(getTaskWithoutRelations(task))}
      index={index}
      id={index}
    >
      {(provided, snapshot) => (
        <Box
          // ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          // isDragging={snapshot.isDragging}
          // as={motion.div}
          // drag
          // borderStyle="dashed"
          borderWidth="1px"
          borderColor="blackAlpha.200"
          shadow="sm"
          transition="box-shadow 1s"
          // borderColor="gray"
          // whileHover={{ borderWidth: '1px' }}
          // dragMomentum={false}
          // dragTransition={{ bounceStiffness: 800, bounceDamping: 10 }}
          // whileTap={{ scale: 0.99 }}
          w="1/3"
          display="inline-block"
          px="2.5"
          py="2"
          positon="relative"
          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
          // shadow={'xl'}
          // boxShadow={'outline'}
        >
          <Flex flexDir="column" margin={1} position="relative">
            <Box position="absolute" right="-3" top="-2">
              {menuIcon}
            </Box>
            {/* <Box pt="4"></Box> */}

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
            <Assignees />
            <Spacer />
            {/* <Flex pt="1px" gap="2" alignItems="center">
              <FaComments size="24px" />
              <Text>{task.comments}</Text>
            </Flex> */}
          </Flex>

          <Spacer />
        </Box>
      )}
    </Draggable>
  );
}

const grid = 1;
export const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2.5,
  margin: `0 0 ${grid}px 0`,

  // background: isDragging ? 'lightgreen' : 'white',
  // change background colour if dragging
  backgroundColor: 'white',
  // transition: 'box-shadow 1s',

  ...(isDragging && {
    // background: 'blue',
    // shadow: 'sm',
    boxShadow: '0px 0px 0px 1px #3182ce',
    // border: '1px solid gray',
  }),
  ...(!isDragging && {
    boxShadow: '0px 0px 0px 0px #FFF',

    // shadow: 'sm',
    // boxShadow: '0px 0px 15px 2px rgba(150,82,0,0.0)',
    // background: 'white',
  }),

  // styles we need to apply on draggables
  ...draggableStyle,
});
export const getListStyle = (isDraggingOver) => ({
  // background: isDraggingOver ? 'lightblue' : '#eeeced99',
  background: '#eeeced33',
  // boxShadow: isDraggingOver ? 'darklg' : 'sm',

  padding: grid,
  width: 'auto',
});
