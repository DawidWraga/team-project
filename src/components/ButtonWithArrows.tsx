import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import {
  Button,
  ButtonProps,
  IconButton,
  IconButtonProps,
  Stack,
} from '@chakra-ui/react';

interface IButtonWithArrows {
  leftProps?: IconButtonProps;
  rightProps?: IconButtonProps;
  centerProps?: ButtonProps;
  centerContent: string | React.ReactNode;
}
export function ButtonWithArrows(props: IButtonWithArrows) {
  const { leftProps, rightProps, centerProps, centerContent } = props;
  const round = 6;

  return (
    <Stack
      flexDirection={'row'}
      spacing={0}
      alignItems="center"
      sx={{
        '& > ': {
          ':first-of-type': {
            borderLeftRadius: round,
            borderRightRadius: 'none',
          },
          ':last-child': {
            borderRightRadius: round,
            borderLeftRadius: 'none',
          },
        },
        '& button': {
          color: 'hsl(0, 0%, 100%)',
          bgColor: 'blue.800',
          fontSize: '1rem',
          px: '6px',
          py: '4px',
        },
        '& button:hover': {
          backgroundColor: 'blue.900',
          // backgroundColor: 'hsla(0, 0%, 100%, 0.1)',
        },
        backdropFilter: 'blur(8px)',
        overflow: 'hidden',
      }}
    >
      <IconButton {...leftProps}>
        <MdChevronLeft />
      </IconButton>
      <Button variant="text" {...centerProps}>
        {centerContent}
      </Button>

      <IconButton {...rightProps}>
        <MdChevronRight />
      </IconButton>
    </Stack>
  );
}
