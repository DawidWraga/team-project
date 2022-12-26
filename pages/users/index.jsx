import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Tag,
  TagRightIcon,
  Badge,
  Avatar,
  Flex,
  Text,
  TagLabel,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { PageWrapper } from 'layouts/PageWrapper';
import { Paper } from 'components/Paper';

import { FaCheck, FaTimes } from 'react-icons/fa';
import { RiLoader4Line } from 'react-icons/ri';
import users from 'db/users.json';
import tasks from 'db/tasks.json';

export default function UsersPage(props) {
  const {} = props;

  return (
    <div>
      <UserTable />
    </div>
  );
}

const roleToColorMap = {
  emp: 'purple.300',
  admin: 'green.400',
  manager: 'blue.400',
};

function UserTable(props) {
  // const { task } = props;
  const router = useRouter();

  return (
    <PageWrapper>
      <TableContainer
        as={Paper}
        maxH={{ base: 'unset', lg: 'calc(95vh - 100px)' }}
        overflowY="auto"
        w="100%"
        variant="elevated"
      >
        <Table>
          <Thead>
            <Tr>
              <Th>User Name</Th>
              <Th>User Email</Th>

              <Th>User Role</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td
                  _hover={{
                    textDecorationLine: 'underline',
                    cursor: 'pointer',
                    textColor: 'blue.500',
                  }}
                  onClick={() => {
                    router.push(`/users/${user.id}`);
                  }}
                >
                  <Tag size="lg" colorScheme="gray" borderRadius="full">
                    <Avatar src={user.img} size="md" ml={-1} mr={2} pr="8px" />
                    <TagLabel _hover={{ colorScheme: 'brand' }}>{user.fullName}</TagLabel>
                  </Tag>
                </Td>
                <Td>{user.email}</Td>
                <Td>
                  <Badge
                    bgColor={roleToColorMap[user.role]}
                    px="7px"
                    py="7px"
                    minW="90px"
                    textAlign="center"
                    textColor={'white'}
                  >
                    {roleCapitalise(user.role)}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </PageWrapper>
  );
}

function roleCapitalise(role) {
  if (role == 'emp') {
    return 'Employee';
  } else if (role == 'admin') {
    return 'Admin';
  } else if (role == 'manager') {
    return 'Manager';
  } else {
    return role;
  }
}

const statusToColorMap = {
  complete: 'green',
  'in-progress': 'yellow',
  todo: 'red',
};

const statusToIconMap = {
  complete: FaCheck,
  'in-progress': () => <RiLoader4Line fontSize="16px" pl="8px" />,
  todo: FaTimes,
};
// function Post(props) {
//     const { post } = props;
//     const { title, name, replies, timesince, usericon, solved, id } = post;

function TaskTable(props) {
  // const { task } = props;

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>Task name</Th>
            <Th>Status</Th>
            <Th>Due date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tasks.map((task) => (
            <Tr key={task.id}>
              <Td>{task.title}</Td>
              <Td>
                <Tag colorScheme={statusToColorMap[task.status]}>
                  {task.status}
                  <TagRightIcon as={statusToIconMap[task.status]} />
                </Tag>
              </Td>
              <Td>{task.due}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
