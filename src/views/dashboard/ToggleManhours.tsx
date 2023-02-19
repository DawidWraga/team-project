import { Flex, Switch, Text } from '@chakra-ui/react';
import { useFilterStore } from 'lib-client/stores/FilterStore';

interface IProps {}
export function ToggleManhours(props: IProps) {
  const {} = props;

  const { taskViewMode, toggleTaskViewMode } = useFilterStore();

  return (
    <Flex
      gap={1}
      alignItems="center"
      border="1px solid lightGray"
      rounded="xl"
      py={1}
      px={1.5}
    >
      <Text wordBreak={'keep-all'}>manhours: </Text>
      <Switch
        size="md"
        isChecked={taskViewMode === 'manhours'}
        onChange={toggleTaskViewMode}
      />
    </Flex>
  );
}
