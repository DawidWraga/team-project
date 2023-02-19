import { IconButton, IconButtonProps, useModals } from '@saas-ui/react';
import { MdOutlineFilterList } from 'react-icons/md';

interface IProps {
  mobileOnly?: boolean;
  content: React.ReactNode;
  iconButtonProps?: Omit<IconButtonProps, 'aria-label'>;
}

const defaultProps: Partial<IProps> = {
  mobileOnly: true,
  iconButtonProps: {},
};

export function FilterMenuButton(props: IProps) {
  const {
    mobileOnly,
    content,
    iconButtonProps: { sx: iconButtonSx, ...iconButtonProps },
  } = { ...defaultProps, ...props };

  const modals = useModals();

  return (
    <>
      <IconButton
        aria-label="open filter menu"
        sx={{
          display: mobileOnly ? { base: 'flex', md: 'none' } : 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          ...iconButtonSx,
        }}
        bgColor="blue.800"
        color="white"
        _hover={{ bgColor: 'blue.900' }}
        onClick={() => modals.drawer({ title: 'Select filters', body: content })}
        {...iconButtonProps}
      >
        <MdOutlineFilterList fontSize="1.3rem" />
      </IconButton>
    </>
  );
}
