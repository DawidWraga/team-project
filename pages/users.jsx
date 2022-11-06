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
} from '@chakra-ui/react';

import {
  AreaChart,
  ResponsiveContainer,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  Pie,
  PieChart,
  Cell,
} from 'recharts';

import { FaCheck, FaTimes } from 'react-icons/fa';
import { RiLoader4Line } from 'react-icons/ri';
import tasks from 'db/tasks.json';

export default function UsersPage(props) {
  const {} = props;

  return (
    <div>
      HR Page content here
      <RenderLineChart />
      <RenderPieChart />
      <TaskTable />
    </div>
  );
}

// const tasks = [
//   { title: 'Email boss man', status: 'Done', due: '11/13/2022' },
//   { title: 'Email boss man', status: 'In progress', due: '11/13/2022' },
//   { title: 'Email boss man', status: 'Not started', due: '11/13/2022' },
//   { title: 'Email boss man', status: 'Done', due: '11/13/2022' },
//   { title: 'Email boss man', status: 'In progress', due: '11/13/2022' },
// ];

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

function TaskTable(props) {
  // const { task } = props;

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
                {/* {task.projectName} */}
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

const datapie = [
  {
    name: 'not started',
    value: 3,
  },
  {
    name: 'in prorgess',
    value: 5,
  },
  {
    name: 'review',
    value: 2,
  },
  {
    name: 'done',
    value: 6,
  },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function RenderPieChart(props) {
  const {} = props;
  return (
    <PieChart width={450} height={300}>
      <Pie
        data={datapie}
        dataKey="value"
        innerRadius={45}
        outerRadius={100}
        cx="50%"
        cy="50%"
        fill="#beabea"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}

const data = [
  {
    name: 'Week 1',
    Set: 12,
    Completed: 10,
  },
  {
    name: 'Week 2',
    Set: 13,
    Completed: 12,
  },
  {
    name: 'Week 3',
    Set: 11,
    Completed: 10,
  },
  {
    name: 'Week 4',
    Set: 12,
    Completed: 12,
  },
  {
    name: 'Week 5',
    Set: 15,
    Completed: 14,
  },
  {
    name: 'Week 6',
    Set: 11,
    Completed: 10,
  },
  {
    name: 'Week 7',
    Set: 10,
    Completed: 10,
  },
];

function RenderLineChart(props) {
  const {} = props;
  return (
    <ResponsiveContainer width="100px">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorSet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FFB042" stopOpacity="0.8" />
            <stop offset="95%" stopColor="#FFB042" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF9500" stopOpacity="0.8" />
            <stop offset="95%" stopColor="#FF9500" stopOpacity="0" />
          </linearGradient>
        </defs>
        <Line type="monotone" dataKey="Set" FFB042="#FFA319" />
        <Line type="monotone" dataKey="Completed" stroke="#FF9500" />
        <CartesianGrid strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="Set"
          stroke="#FFB042"
          fillOpacity={1}
          fill="url(#colorSet)"
        />
        <Area
          type="monotone"
          dataKey="Completed"
          stroke="#FF9500"
          fillOpacity={1}
          fill="url(#colorCompleted)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
