import { Badge, Box, Grid, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { Paper } from 'styles/Paper';
import { KanbanCol } from 'components/tasks/KanbanCol';

export default function ProjectKanbanPage(props) {
  const {} = props;
  return (
    <Box display="grid" gridTemplateColumns="repeat(3,1fr)" overflowX="auto">
      <KanbanCol />
      <KanbanCol />
      <KanbanCol />
    </Box>
  );
}
