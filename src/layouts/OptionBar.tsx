import { Flex } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { headerHeight, optionBarHeight } from 'lib-client/constants';
import { useLayoutStore } from 'lib-client/stores/LayoutStore';

interface IProps {}

export default function OptionBar(props: IProps) {
  const {} = props;
  const { optionBarIsOpen, optionBar, leftOffset, sideNavIsOpen } = useLayoutStore();

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
          ml={leftOffset}
          transition="left 150ms ease-in-out, padding-right 150ms ease-in-out"
          w="99.5%"
          h={optionBarHeight + 'px'}
          borderBottom={'1px solid'}
          borderBottomColor={'blackAlpha.200'}
          zIndex="dropdown !important"
          textColor="white"
          alignItems="center"
          px={[2, 3, 4, 5]}
          pr={sideNavIsOpen ? leftOffset : 0}
          // warning: enabling x scroll causes date select menu to be hidden
          // overflowY="visible"
          // overflowX="auto"
          color="shade.main"
        >
          {optionBar}
        </Flex>
      )}
    </AnimatePresence>
  );
}
