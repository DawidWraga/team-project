import { Tooltip, Pie, PieChart as BasePieChart, Cell, Label } from 'recharts';
import { range } from 'utils/range';
import { randomNum } from 'utils/randomNum';

let renderLabel = function (entry) {
  return entry.name;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function PieChart(props) {
  const { pieChartData } = props;

  const total = pieChartData.map((obj) => obj.value).reduce((a, b) => a + b);
  return (
    console.log({ total }),
    (
      <BasePieChart width={400} height={400}>
        <text x="200" y="200" fontSize="10px">
          {total}
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
