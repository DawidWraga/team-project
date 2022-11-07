import {
	Tooltip,
	Pie,
	PieChart as BasePieChart,
	Cell,
	Label,
	ResponsiveContainer,
} from 'recharts';
import { range } from 'utils/range';
import { randomNum } from 'utils/randomNum';
import { Grid } from '@chakra-ui/react';

let renderLabel = function (entry) {
	return entry.name;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function PieChart(props) {
	const { pieChartData } = props;

	const total = pieChartData.map((obj) => obj.value).reduce((a, b) => a + b);

	return (
		<ResponsiveContainer
			width={'100%'}
			height={'100%'}
			// minWidth="250px"
			// minHeight="250px"
			aspect={'1'}
		>
			<BasePieChart>
				{/* <text x="200" y="200" fontSize="10px">
						{total}
					</text> */}
				<Pie
					data={pieChartData}
					dataKey="value"
					innerRadius={45}
					outerRadius={105}
					cx="55%"
					cy="45%"
					fill="#beabea"
					label={renderLabel}
				>
					{range(5).map((entry, index) => (
						<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
					))}
				</Pie>
				<Tooltip />
			</BasePieChart>
		</ResponsiveContainer>
	);
}
