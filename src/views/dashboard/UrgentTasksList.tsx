// @ts-nocheck
import { Box, Flex } from '@chakra-ui/react';
import { TaskStatus } from '@prisma/client';
import { DataTable } from '@saas-ui/react';
import { Metric, Text } from '@tremor/react';
import moment from 'moment';
import { CompleteTask } from 'prisma/zod';
import { useMemo, useRef } from 'react';
import { getOpenTasks } from 'utils/getTasksGroupedByStatuses';

interface IProps {
  tasks: Partial<CompleteTask>[];
  closedStatuses: TaskStatus[];
  title?: string;
}

export function UrgentTasksList(props: IProps) {
  const { tasks, closedStatuses, title } = props;

  const incompleteTasksInOrder = useMemo(() => {
    const incompleteTasks = getOpenTasks(tasks as any, closedStatuses);

    return incompleteTasks?.sort((a, b) => {
      const aDate = moment(a.dueDate);
      const bDate = moment(b.dueDate);
      if (aDate.isBefore(bDate)) return -1;
      if (aDate.isAfter(bDate)) return 1;
      return 0;
    });
  }, [tasks, closedStatuses]);

  const columns: any = [
    {
      accessor: 'description',
      Header: 'Task',
    },
    {
      accessor: 'status',
      Header: 'Status',
    },
    {
      accessor: 'dueDate',
      Header: 'Due Date',
    },
  ];

  const tableRef = useRef<any>(null);
  return (
    <Box w="100%" h="100%" overflowX="auto">
      <Flex gap={2} alignItems="flex-end" mb={4}>
        <Metric>{title || 'Upcoming Tasks'}</Metric>
        <Text> Incomplete tasks sorted by due date </Text>
      </Flex>
      <DataTable<any>
        ref={tableRef}
        columns={columns as any}
        isSortable
        getSubRows={(row) => {
          console.log(row);
          // row.subRows
        }}
        data={incompleteTasksInOrder?.map((t: any) => {
          console.log(t);
          return {
            id: t.id,
            description: t.title,
            status: t.status?.label,
            dueDate: moment(t?.dueDate).format('DD/MM/YYYY'),
          };
        })}
      />
    </Box>
  );
}
