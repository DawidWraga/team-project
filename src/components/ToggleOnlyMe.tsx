import { Flex, FlexProps, Switch, Text } from '@chakra-ui/react';
import { useFilterStore } from 'lib-client/stores/FilterStore';

interface IProps {
  containerProps?: FlexProps;
}
export function ToggleOnlyMe(props: IProps) {
  const { containerProps } = props;

  const { onlyMe, toggleOnlyMe } = useFilterStore();

  return (
    <Flex
      gap={1}
      alignItems="center"
      border="1px solid lightGray"
      rounded="xl"
      py={1}
      px={1.5}
      {...containerProps}
    >
      <Text whiteSpace="nowrap">Only me:</Text>
      <Switch size="md" isChecked={onlyMe} onChange={toggleOnlyMe} />
    </Flex>
  );
}
