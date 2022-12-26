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
import { Box, Text } from '@chakra-ui/react';

let renderLabel = function (entry) {
	return entry.name;
};

const COLORS = ['#FF8042', '#FFBB28', '#00C49F', '#0088FE'];

export function PieChart(props) {
	const { pieChartData } = props;

	const total = pieChartData.map((obj) => obj.value).reduce((a, b) => a + b);
	return (
		<div className="relative w-full h-full">
			<Box
				position="absolute"
				left="50%"
				top="50%"
				transform={'auto'}
				translateX="-50%"
				translateY="-50%"
				className="animate-slowfade"
			>
				<Text
					x="242"
					y="180"
					fontSize="16px"
					fontWeight={'bold'}
					textAlign={'center'}
				>
					{total}
				</Text>
				<Text x="225" y="220" fontSize="12px" textAlign={'center'}>
					Total tasks
				</Text>
			</Box>
			<ResponsiveContainer>
				<BasePieChart width={500} height={400}>
					<Pie
						data={pieChartData}
						dataKey="value"
						innerRadius={45}
						outerRadius={100}
						cx="50%"
						cy="50%"
						fill="#beabea"
						label={(entry) => entry.name}
					>
						{range(5).map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={COLORS[index % COLORS.length]}
							/>
						))}
					</Pie>
					<Tooltip />
				</BasePieChart>
			</ResponsiveContainer>
		</div>
	);
}
