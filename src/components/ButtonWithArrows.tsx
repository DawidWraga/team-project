import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import {
  Button,
  ButtonProps,
  IconButton,
  IconButtonProps,
  Stack,
  StackProps,
} from '@chakra-ui/react';

interface IButtonWithArrows {
  leftProps?: IconButtonProps;
  rightProps?: IconButtonProps;
  centerProps?: ButtonProps;
  centerContent: string | React.ReactNode;
  containerProps?: StackProps;
}
export function ButtonWithArrows(props: IButtonWithArrows) {
  const { leftProps, rightProps, centerProps, centerContent, containerProps } = props;
  const round = 6;

  return (
    <Stack
      flexDirection={'row'}
      spacing={0}
      alignItems="center"
      overflow="visible"
      {...(() => {
        // spread container props
        if (!containerProps) return {};

        // omit sx and combine in next property instead
        if (containerProps.sx) {
          const { sx, ...rest } = containerProps;
          return rest;
        }

        return containerProps;
      })()}
      sx={{
        ...containerProps?.sx,
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
        // overflow: 'hidden',
      }}
    >
      <IconButton {...leftProps}>
        <MdChevronLeft />
      </IconButton>
      {/* <Button variant="text" {...centerProps}>
      </Button> */}
      {centerContent}

      <IconButton {...rightProps}>
        <MdChevronRight />
      </IconButton>
    </Stack>
  );
}
