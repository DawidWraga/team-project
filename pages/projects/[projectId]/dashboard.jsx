import { getProjectData } from 'controllers/getProjectData';
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
  Label,
} from 'recharts';

import {
  Stat,
  StatLabel,
  StatHelpText,
  StatGroup,
  StatNumber,
  Grid,
  GridItem,
  Flex,
  Box,
} from '@chakra-ui/react';

export const getServerSideProps = async (ctx) => {
	const project = await getProjectData(ctx.query.projectId);
	return {
		props: { project },
	};
};

export default function ProjectDashboardPage(props) {
  const {} = props;

	
  return (
    <div>
      <Flex flexDir="column" w="100%" h="600px">
        <Box h="100%">
          <RenderLineChart />
        </Box>
        <Flex
          bgColor={'blue.500'}
          h="100%"
          flexDir={{ base: 'column', md: 'row' }}
        >
          <Box
            bgColor="green.500"
            h="100%"
            w={{ base: '100%', md: '66%' }}
            flexGrow={1}
          >
            <StatsLine1 />
            <StatsLine2 />
          </Box>
          <Box bgColor="yellow.500" h="100%" flexGrow={1}>
            <RenderPieChart />
          </Box>
        </Flex>
      </Flex>
    </div>
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

function RenderLineChart(props) {
  const {} = props;
  return (
    <ResponsiveContainer width="90%">
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

function StatsLine1(props) {
  const {} = props;

  return (
    <StatGroup>
      <Stat>
        <StatLabel>Number of days to project deadline</StatLabel>
        <StatNumber>43 days</StatNumber>
        <StatHelpText>Deadline: 27th of December 2022</StatHelpText>
      </Stat>
      <Stat>
        <StatLabel>Number of days to next project milestone</StatLabel>
        <StatNumber>10 days</StatNumber>
        <StatHelpText>Milestone: 20th of November 2022</StatHelpText>
      </Stat>
    </StatGroup>
  );
}

function StatsLine2(props) {
  const {} = props;

  return (
    <StatGroup>
      <Stat>
        <StatLabel>Number of tasks for this week</StatLabel>
        <StatNumber>38</StatNumber>
        <StatHelpText>Deadline: 27th of December 2022</StatHelpText>
      </Stat>
      <Stat>
        <StatLabel>Number of overdue tasks</StatLabel>
        <StatNumber>7</StatNumber>
        <StatHelpText>Milestone: 20th of November 2022</StatHelpText>
      </Stat>
    </StatGroup>
  );
}

let renderLabel = function (entry) {
  return entry.name;
};

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
        label={renderLabel}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}
