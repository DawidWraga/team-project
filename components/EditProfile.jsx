import { Button, Flex, Input } from '@chakra-ui/react';
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { Grid, GridItem } from '@chakra-ui/react';
import { HiInformationCircle } from 'react-icons/hi';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from '@chakra-ui/react';

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
                <Flex flexDirection={'row'} gap="50px">
                  <Flex pt={'10px'} fontSize={'13'} fontWeight="normal">
                    New Password
                  </Flex>
                  <Flex paddingTop={'11px'}>
                    <Popover placement="left">
                      <PopoverTrigger>
                        <HiInformationCircle></HiInformationCircle>
                      </PopoverTrigger>
                      <PopoverContent borderColor={'brand.500'}>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader fontSize={'13px'} fontWeight={'bold'}>
                          Password Requirements
                        </PopoverHeader>
                        <PopoverBody fontSize={'13px'}>
                          Passwords must include at least one upper case, one
                          number, one special character and must be atleast 12
                          characters long.
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Flex>
                </Flex>

                <Input paddingBottom={'10px'} height="30px" type="password" />
              </FormControl>
              <Flex paddingTop={'15px'}>
                <Button
                  fontSize={'13'}
                  colorScheme={'brand'}
                  h="30px"
                  w="200px"
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
