import {
	AreaChart,
	ResponsiveContainer,
	Line,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Area,
} from 'recharts';
import { range } from 'utils/range';
import { randomNum } from 'utils/randomNum';

export function getLineChartDummyData() {
	const data = range(8).map((n) => {
		const total = randomNum(10, 20);
		return {
			name: 'Week ' + (n + 1),
			Set: total,
			Completed: randomNum(5, total),
		};
	});
	return data;
}

export function LineChart(props) {
	const { data } = props;

	const defaultColors = {
		primary: 'hsl(32, 100%, 53%)',
		secondary: 'hsl(36, 100%, 65%)',
	};

	const colors = props.colors ?? defaultColors;

	return (
		<ResponsiveContainer width="100%">
			<AreaChart data={data}>
				<defs>
					<linearGradient id="colorSet" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor={colors.primary} stopOpacity="0.8" />
						<stop offset="95%" stopColor={colors.primary} stopOpacity="0" />
					</linearGradient>
					<linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor={colors.secondary} stopOpacity="0.8" />
						<stop offset="95%" stopColor={colors.secondary} stopOpacity="0" />
					</linearGradient>
				</defs>
				<Line type="monotone" dataKey="Set" FFB042={colors.primary} />
				<Line type="monotone" dataKey="Completed" stroke={colors.secondary} />
				<CartesianGrid strokeDasharray="5 5" />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip />
				<Area
					type="monotone"
					dataKey="Set"
					stroke={colors.secondary}
					fillOpacity={1}
					fill="url(#colorSet)"
				/>
				<Area
					type="monotone"
					dataKey="Completed"
					stroke={colors.primary}
					fillOpacity={1}
					fill="url(#colorCompleted)"
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
}
