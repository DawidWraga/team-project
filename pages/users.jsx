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

import { FaCheck, FaTimes } from 'react-icons/fa';
import { RiLoader4Line } from 'react-icons/ri';
import tasks from 'db/tasks.json';

export default function UsersPage(props) {
	const {} = props;

	return (
		<div>
			HR Page content here <TaskTable />
		</div>
	);
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
