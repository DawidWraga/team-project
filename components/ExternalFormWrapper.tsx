import { Flex } from '@chakra-ui/react';
import { BrandLogoWithName } from 'components/BrandLogo';
import { DesktopOnly } from 'components/deviceTypes';

interface IProps {
  children: React.ReactNode;
}

export default function ExternalFormWrapper(props: IProps) {
  const { children } = props;

  return (
    <Flex
      className="bg-pale-main w-screen h-screen grid"
      w="100vw"
      h="100vh"
      justifyContent={'center'}
    >
      <Flex
        as="main"
        className="bg-white justify-center  rounded-lg shadow-xl "
        bgColor="white"
        h={{ base: '100vh' }}
        w="100vw"
        maxW={{ base: '100vw', lg: '750px' }}
        alignContent="center"
        alignItems="center"
        justifyItems={'center'}
        roundedRight={{ lg: '3xl' }}
        flexDir="column"
      >
        {children}
      </Flex>
      <DesktopOnly w="100%" h="100vh" display="flex" justifyContent="center">
        <BrandLogoWithName
          sx={{
            '& > svg': { fontSize: '7rem' },
            '& > h2': { fontSize: '4rem' },
          }}
        />
      </DesktopOnly>
    </Flex>
  );
}
