import { Box } from '@chakra-ui/react';

export function MobileOnly(props) {
  const { children, display, ...restProps } = props;

  return (
    <Box display={{ base: display || 'inline-block', lg: 'none' }} {...restProps}>
      {children}
    </Box>
  );
}

export function DesktopOnly(props) {
  const { children, display, ...restProps } = props;

  return (
    <Box display={{ base: 'none', lg: display || 'inline-block' }} {...restProps}>
      {children}
    </Box>
  );
}

export function ScreenDependent(props) {
  const { childBoth, Desktop, Mobile } = props;

  return (
    <>
      <MobileOnly>
        <Mobile>{childBoth && childBoth}</Mobile>
      </MobileOnly>
      <DesktopOnly>
        <Desktop>{childBoth && childBoth}</Desktop>
      </DesktopOnly>
    </>
  );
}
