import { Flex } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { headerHeight, optionBarHeight } from 'lib-client/constants';
import { useLayoutStore } from 'lib-client/stores/LayoutStore';

interface IProps {}

export default function OptionBar(props: IProps) {
  const {} = props;
  const { optionBarIsOpen, optionBar, leftOffset, topOffset } = useLayoutStore();

  return (
    <AnimatePresence>
      {optionBarIsOpen && (
        <Flex
          as={motion.div}
          variants={{
            open: {
              top: headerHeight + 'px',
              transition: {
                ease: 'easeInOut',
                duration: 0.15,
              },
            },
            closed: {
              top: 0,
              transition: {
                ease: 'easeInOut',
                duration: 0.3,
              },
            },
          }}
          initial="closed"
          animate="open"
          exit="closed"
          position="fixed"
          left={leftOffset}
          transition="left 150ms"
          w="100%"
          h={optionBarHeight + 'px'}
          bgColor="pale.dark"
          zIndex="dropdown !important"
          textColor="white"
          alignItems="center"
          px={[2, 3, 4, 5]}
        >
          {optionBar}
        </Flex>
      )}
    </AnimatePresence>
  );
}
