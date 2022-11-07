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
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { FaCheck, FaTimes } from 'react-icons/fa';
import { RiLoader4Line } from 'react-icons/ri';
import { toast } from 'react-toastify';

const statusToColorMap = {
  complete: 'green',
  'in-progress': 'yellow',
  todo: 'red',
};

const statusToIconMap = {
  complete: FaCheck,
  'in-progress': () => <RiLoader4Line fontSize="16px" />,
  todo: FaTimes,
};

export function UserTasksList(props) {
  const { tasks } = props;
  const router = useRouter();
  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>Task name</Th>
            <Th>Task description</Th>
            <Th>Status</Th>
            <Th>Due date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tasks.map((task) => (
            <Tr key={task.id}>
              <Td>
                <Text
                  fontSize="sm"
                  textColor="grey.100"
                  _hover={{
                    textDecorationLine: 'underline',
                    cursor: 'pointer',
                    textColor: 'blue.500',
                  }}
                  onClick={() => {
                    router.push(`/projects/${task.projectId}/tasks`);
                  }}
                >
                  {task.projectName}
                </Text>

                {task.title}
              </Td>
              <Td>{task.description}</Td>
              <Td>
                <Tag colorScheme={statusToColorMap[task.status]}>
                  {task.status}
                  <TagRightIcon as={statusToIconMap[task.status]} />
                </Tag>
              </Td>
              <Td>{task.dueDate}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
