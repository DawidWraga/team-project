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

export function UserTasksList(props) {
	const { tasks } = props;

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
