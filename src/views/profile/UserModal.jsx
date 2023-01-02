import {
  Modal,
  ModalOverlay,
  ModalContent, ModalBody,
  ModalCloseButton, Box,
  Flex,
  Avatar,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Progress
} from '@chakra-ui/react';

import EditProfile from './EditProfile';
import Profile from './Profile';

export default function UserModal(props) {
  const { isOpen, onClose } = props;
  return (
    <>
      <Modal
        closeOnEsc="true"
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="scale"
        isCentered="true"
      >
        <ModalOverlay />
        <ModalContent overflow={'hidden'}>
          <ModalCloseButton />
          <ModalBody p="0">
            <Box roundedBottom={'4'} height={'45px'} bg="brand.500"></Box>
            <Box height={'320E'} px="3" py="1">
              <Flex height="1px" gap="3" w="100%">
                <Avatar
                  border="2px solid white"
                  size="xl"
                  position="relative"
                  bottom={'35px'}
                ></Avatar>
                <Flex flexDirection={'column'}>
                  <Text fontSize={'20px'} fontWeight={'semibold'}>
                    John White
                  </Text>
                  <Text position={'relative'} bottom="1" fontSize={'15px'}>
                    Project Manager
                  </Text>
                </Flex>
              </Flex>

              <Tabs colorScheme={'brand'} paddingTop="16">
                <TabList>
                  <Tab>Profile</Tab>
                  <Tab>Edit Profile</Tab>
                  <Tab>Activity</Tab>
                </TabList>

                <TabPanels h="180px">
                  <TabPanel>
                    <Profile></Profile>
                  </TabPanel>
                  <TabPanel>
                    <EditProfile></EditProfile>
                  </TabPanel>
                  <TabPanel>
                    <Flex fontSize={'13px'}> Project 1 Progress</Flex>
                    <Flex height="5px"></Flex>

                    <Progress
                      isAnimated="true"
                      hasStripe
                      value={80}
                      size="xs"
                      height="15px"
                      colorScheme="brand"
                    />

                    <Flex fontSize={'13px'} paddingTop={'20px'}>
                      Project 2 Progress
                    </Flex>
                    <Flex height="5px"></Flex>

                    <Progress
                      isAnimated="true"
                      hasStripe
                      value={40}
                      size="xs"
                      height="15px"
                      colorScheme="brand"
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
