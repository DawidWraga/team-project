import { Tooltip, Pie, PieChart as BasePieChart, Cell } from 'recharts';
import { range } from 'utils/range';
import { randomNum } from 'utils/randomNum';

let renderLabel = function (entry) {
	return entry.name;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function PieChart(props) {
	const { pieChartData } = props;
	return (
		<BasePieChart width={450} height={300}>
			<Pie
				data={pieChartData}
				dataKey="value"
				innerRadius={45}
				outerRadius={100}
				cx="50%"
				cy="50%"
				fill="#beabea"
				label={renderLabel}
			>
				{range(5).map((entry, index) => (
					<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
				))}
			</Pie>
			<Tooltip />
		</BasePieChart>
	);
}
