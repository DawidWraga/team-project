import tasks from 'db/tasks.json';
import { LineChart, getLineChartDummyData } from 'components/charts/LineChart';
import { PieChart } from 'components/charts/PieChart';
import { UserTasksList } from 'components/dashboards/UserTasksList';
import { randomNum } from 'utils/randomNum';

export function UserDashboard(props) {
	const {} = props;

	const lineChartData = getLineChartDummyData();

	const pieChartData = [
		{
			name: 'not started',
			value: randomNum(0, 10),
		},
		{
			name: 'in progress',
			value: randomNum(0, 10),
		},
		{
			name: 'review',
			value: randomNum(0, 10),
		},
		{
			name: 'done',
			value: randomNum(0, 10),
		},
	];

	return (
		<div>
			<LineChart data={lineChartData} />
			<PieChart pieChartData={pieChartData} />
			<UserTasksList tasks={tasks} />
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
