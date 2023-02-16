import {
  Avatar,
  AvatarGroup,
  Box,
  Text,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  Spacer,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { FaClock } from 'react-icons/fa';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import moment from 'moment';
import { DraggableWrapper } from 'components/DragNDrop';
import { ControllerWrapper } from 'lib-client/controllers/ControllerWrapper';
import { useModals } from '@saas-ui/react';
import { useTaskModal } from 'views/task/useTaskModal';
import { EditSubtasks } from 'views/task/EditSubtasks';

const tagToColorMap = {
  design: 'cyan.500',
  develop: 'purple.300',
};

export function Task(props) {
  const { task, index } = props;

  const { openTaskModal } = useTaskModal();

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
      {({ dragHandleProps }) => {
        return (
          <>
            <Flex flexDir="column" margin={1} position="relative">
              <Flex
                alignItems="flex-end"
                justifyContent="flex-end"
                flexDir={'column-reverse'}
                py="1.5"
                px="1"
                w="40px"
                ml="auto"
              >
                <Box>
                  <AvatarGroup size="xs" max={5} alignContent="left" gap="1">
                    {task?.assignees?.map((user) => {
                      return (
                        <Tooltip key={user.id} label={user.fullName}>
                          <Avatar
                            size="xs"
                            borderColor="grey.50"
                            name={user.fullName}
                            // src={user.userIcon}
                            // loading="eager"
                            // loading="lazy"
                          />
                        </Tooltip>
                      );
                    })}
                  </AvatarGroup>
                </Box>

                <Text
                  as={Flex}
                  alignItems="center"
                  fontSize="sm"
                  fontWeight="normal"
                  textColor="gray.600"
                  gap={1}
                  {...dragHandleProps}
                >
                  {moment(task.dueDate).format('DD/MM/YYYY')}
                  <FaClock display="inline" />
                </Text>
              </Flex>

              <Text
                fontSize={'xl'}
                textAlign="left"
                textColor="gray.800"
                fontWeight="semibold"
                mb="1"
                _hover={{ cursor: 'pointer' }}
                onClick={(ev) => {
                  ev.stopPropagation();
                  openTaskModal(task);
                }}
              >
                {task.title}
              </Text>

              <Text fontSize="sm" fontWeight="normal" textColor="gray.600">
                {task.description}
              </Text>
            </Flex>
            <EditSubtasks task={task} />
          </>
        );
      }}
    </DraggableWrapper>
  );
}
