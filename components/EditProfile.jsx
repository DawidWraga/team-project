import { Button, Flex, Input } from '@chakra-ui/react';
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { Grid, GridItem } from '@chakra-ui/react';
import { HiInformationCircle } from 'react-icons/hi';

export default function EditProfile(props) {
  const {} = props;

  return (
    <>
      <Grid templateColumns="repeat(2, 1fr)" gap={1}>
        <GridItem w="100%" h="100%" bg="white">
          <Flex>
            <Flex width="160px" flexDirection={'column'}>
              <FormControl>
                <FormLabel fontSize={'13'} fontWeight="normal">
                  Current Password
                </FormLabel>
                <Input height="30px" type="password" />
              </FormControl>

              <FormControl>
                <FormLabel pt={'10px'} fontSize={'13'} fontWeight="normal">
                  New Password
                </FormLabel>
                <Input paddingBottom={'10px'} height="30px" type="password" />
              </FormControl>
              <Flex paddingTop={'15px'}>
                <Button
                  fontSize={'13'}
                  colorScheme={'brand'}
                  h="30px"
                  w="200px"
                  on
                >
                  Update
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </GridItem>

        <GridItem w="100%" h="100%" bg="white">
          <Flex flexDirection={'column'} fontSize={'13px'}>
            <Flex paddingBottom={'7.5px'}>Update Profile Picture </Flex>
            <Grid
              templateColumns="repeat(2, 1fr)"
              gap={1.5}
              backgroundColor="white"
            >
              <GridItem w="100%" h="10">
                <Button
                  fontSize={'13'}
                  colorScheme={'telegram'}
                  h="30px"
                  w="100%"
                  on
                >
                  Update
                </Button>
              </GridItem>

              <GridItem w="100%" h="10">
                <Button
                  fontSize={'13'}
                  colorScheme={'gray'}
                  h="30px"
                  w="100%"
                  on
                >
                  Remove
                </Button>
              </GridItem>
            </Grid>
          </Flex>
        </GridItem>
      </Grid>
    </>
  );
}
