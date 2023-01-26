import { userController } from 'lib-client/controllers';
import { useDebounce } from 'lib-client/hooks/useDebouce';
import { Select } from 'chakra-react-select';

import { keepFloatingLabelActive } from 'utils/keepFloatingLabelActive';

const userDummyData = [
  {
    label: 'steve',
    value: 1,
  },
  {
    label: 'bob',
    value: 2,
  },
  {
    label: 'me',
    value: 3,
  },
];

export const UserSelect = ({ defaults, field: { ...field }, ...props }: any) => {
  // const { data: users, isLoading } = userController.useQuery('findMany', {
  //   staleTime: 60 * 60 * 100000,
  //   initialData: userDummyData as any,
  // });

  return (
    <Select
      options={userDummyData}
      {...field}
      onBlur={(ev) => {
        const keepActive = field.value && (field.value as any).length > 0;
        keepFloatingLabelActive(ev.target, keepActive);
      }}
      isMulti
      // _loading={isLoading}
      chakraStyles={{
        container: (prev) => ({
          ...prev,
          shadow: defaults.shadow || '',
          borderColor: defaults.borderColor || '',
        }),
        inputContainer: (prev) => ({
          ...prev,
          // py: 2,
          h: '40px',
          alignItems: 'center',
          justiftContent: 'center',
        }),
      }}
      {...props}
    />
  );
};
