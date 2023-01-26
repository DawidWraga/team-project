import { Heading, HeadingProps } from '@chakra-ui/react';

export function FormHeading({ children, ...props }: HeadingProps) {
  return (
    <Heading
      fontSize={[20, 22, 24]}
      wordBreak="revert"
      mx="auto"
      // ml="3.7rem"
      mt="1rem"
      textAlign={'center'}
      fontWeight="semibold"
      mb="2"
      {...props}
    >
      {children}
    </Heading>
  );
}
