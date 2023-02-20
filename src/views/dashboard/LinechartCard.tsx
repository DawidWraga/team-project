import {
  Card,
  Metric,
  Text,
  AreaChart,
  BadgeDelta,
  Flex,
  DeltaType,
  ColGrid,
  ValueFormatter,
} from '@tremor/react';

interface IProps {
  title: string;
  deltaType: DeltaType;
  delta: string;
  metric: string;
  metricPrev: string;
  linechartData: any;
  linechartProps?: Partial<React.ComponentProps<typeof AreaChart>>;
}

const defaultProps: Partial<IProps> = {
  linechartProps: {},
};

export function LinechartCard(props: IProps) {
  const {
    title,
    deltaType,
    delta,
    metric,
    metricPrev,
    linechartData,
    linechartProps: { categories, ...lineChartProps },
  } = { ...defaultProps, ...props };

  return (
    <Card hFull={true}>
      <Flex alignItems="items-start">
        <Text>{title}</Text>
        <BadgeDelta deltaType={deltaType} text={delta} />
      </Flex>
      <Flex
        justifyContent="justify-start"
        alignItems="items-baseline"
        spaceX="space-x-3"
        truncate={true}
      >
        <Metric>{metric}</Metric>
        <Text>from {metricPrev}</Text>
      </Flex>
      <AreaChart
        marginTop="mt-3"
        data={linechartData}
        dataKey="Month"
        categories={categories || [title]}
        colors={['blue']}
        showXAxis={true}
        showGridLines={false}
        startEndOnly={true}
        showYAxis={false}
        showLegend={false}
        height={'h-48' as any}
        {...lineChartProps}
      />
    </Card>
  );
}
