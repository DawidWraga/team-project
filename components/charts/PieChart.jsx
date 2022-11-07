import { Tooltip, Pie, PieChart as BasePieChart, Cell, Label } from 'recharts';
import { range } from 'utils/range';
import { randomNum } from 'utils/randomNum';

let renderLabel = function (entry) {
  return entry.name;
};

const COLORS = ['#FF8042', '#FFBB28', '#00C49F', '#0088FE'];

export function PieChart(props) {
  const { pieChartData } = props;

  const total = pieChartData.map((obj) => obj.value).reduce((a, b) => a + b);
  return (
    console.log({ total }),
    (
      <BasePieChart width={500} height={400}>
        <text x="242" y="180" fontSize="16px" alignmentBaseline="central">
          {total}
        </text>
        <text x="225" y="220" fontSize="10px" alignmentBaseline="baseline">
          Total tasks
        </text>
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
    )
  );
}
