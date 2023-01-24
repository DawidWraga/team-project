import { Heading, HeadingProps } from '@chakra-ui/react';

export function FormHeading({ children, ...props }: HeadingProps) {
  return (
    <Heading
      fontSize={[26, 28, 30]}
      wordBreak="revert"
      mx="auto"
      textAlign={'center'}
      fontWeight="semibold"
      mb="2"
      {...props}
    >
      {children}
    </Heading>
  );
}
