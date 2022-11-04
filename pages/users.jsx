import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Tag,
  TagRightIcon,
  CircularProgress,
} from '@chakra-ui/react';

import { FaCheck, FaTimes } from 'react-icons/fa';
import { RiLoader4Line } from 'react-icons/ri';


export default function UsersPage(props) {
  const {} = props;

  return (
    <div>
      HR Page content here <TaskTable />
    </div>
  );
}

const tasks = [
  { title: 'Email boss man', status: 'Done', due: '11/13/2022' },
  { title: 'Email boss man', status: 'In progress', due: '11/13/2022' },
  { title: 'Email boss man', status: 'Not started', due: '11/13/2022' },
  { title: 'Email boss man', status: 'Done', due: '11/13/2022' },
  { title: 'Email boss man', status: 'In progress', due: '11/13/2022' },
];

const statusToColorMap = {
  Done: 'green',
  'In progress': 'yellow',
  'Not started': 'red',
};

const statusToIconMap = {
  Done: FaCheck,
  'In progress': () => <RiLoader4Line fontSize="16px" pl="8px" />,
  'Not started': FaTimes,
};
// function Post(props) {
//     const { post } = props;
//     const { title, name, replies, timesince, usericon, solved, id } = post;

function TaskTable(props) {
  const { task } = props;

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
            <Tr key={task.title}>
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