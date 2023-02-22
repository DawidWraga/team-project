import { Box, Flex } from '@chakra-ui/react';
import { Project, TaskStatus, User } from '@prisma/client';
import { Column, DataTable } from '@saas-ui/react';
import { Metric, Text } from '@tremor/react';
import moment from 'moment';
import { CompleteTask } from 'prisma/zod';
import { useMemo, useRef } from 'react';
import { getOpenTasks } from 'utils/getTasksGroupedByStatuses';

import {
  getProjectStatuses,
  getTasksByStatus,
  getTasksByAssignee,
} from 'utils/dashboardUtils';

interface IProps {
  tasks: Partial<CompleteTask>[];
  users: User[];
  project: Project;
}

interface ColData {
  fullName: string;
  todo: number | string;
  'in-progress': number | string;
  complete: number | string;
  total: number | string;
}

export function UserList(props: IProps) {
  const { tasks, project, users } = props;

  const { endStatus, startStatus } = getProjectStatuses(project);

  const columns: Column<ColData>[] = [
    {
      accessor: 'fullName',
      Header: 'Name ',
      width: 'auto',
    },
    {
      accessor: 'todo',
      Header: 'Todo',
      isNumeric: true,
      width: 60,
    },
    {
      accessor: 'in-progress',
      Header: 'in-progress',
      isNumeric: true,
      width: 60,
    },
    {
      accessor: 'complete',
      Header: 'Complete',
      isNumeric: true,
      width: 60,
    },
    {
      accessor: 'total',
      isNumeric: true,
      width: 60,
      Header: 'Total',
    },
  ];

  const tableRef = useRef<any>(null);
  return (
    <Box w="100%" h="100%" overflowX="auto">
      <Flex gap={2} alignItems="flex-end" mb={4}>
        <Metric>Employees productivity</Metric>
      </Flex>
      <DataTable<ColData>
        ref={tableRef}
        columns={columns as any}
        isSortable
        // variant=""
        size="lg"
        data={users?.map((user: any) => {
          const userTasks = getTasksByAssignee(tasks as any, user.id);
          const todoTasks = getTasksByStatus(userTasks, startStatus.id);
          const doneTasks = getTasksByStatus(userTasks, endStatus.id);

          return {
            fullName: user.fullName,
            todo: todoTasks?.length || '0',
            'in-progress':
              userTasks?.length - todoTasks?.length - doneTasks?.length || '0',
            complete: doneTasks?.length || '0',
            total: userTasks.length || '0',
          };
        })}
      />
    </Box>
  );
}
