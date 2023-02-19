import { IconButton, Text, Box, Tag } from '@chakra-ui/react';
import { controller } from 'lib-client/controllers';
import { MenuButton, Menu, MenuList, MenuItem } from '@chakra-ui/react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { List, Loading, SearchInput } from '@saas-ui/react';
import moment from 'moment';
import { MdEdit } from 'react-icons/md';
import { useProjectModal } from 'views/task/useProjectModal';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { useLayoutStore } from 'lib-client/stores/LayoutStore';
import { CustomAvatarGroup } from 'components/CustomAvatarGroup';
import { RoleGuard } from 'components/RoleGuard';

export default function DocsPage(props) {
  const {} = props;
  const router = useRouter();

  const { useSetOptionBar } = useLayoutStore();
  useSetOptionBar(
    <Flex gap={2} justifyContent={'space-between'} w="100%">
      <Flex gap={2}>
        <RoleGuard allowed={['admin', 'manager']}>
          <Button
            colorScheme={'brand'}
            variant={'solid'}
            onClick={() => {
              router.push('/docs/new');
              // openTaskModal();
            }}
          >
            Add Document
          </Button>
        </RoleGuard>
      </Flex>
    </Flex>
  );

  const [searchTerm, setSearchTerm] = useState('');

  const { data: docs, isLoading } = controller.useQuery({
    model: 'document',
    query: 'findMany',
    prismaProps: {
      include: {
        authors: true,
        tags: true,
      },
    },
    select: (docs) =>
      docs.filter((doc) => doc.title.toLowerCase().includes(searchTerm.toLowerCase())),
  });

  const { openProjectModal } = useProjectModal();

  return (
    <Box p={1}>
      <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      {isLoading ? (
        <Loading />
      ) : (
        docs && (
          <List
            items={docs.map((doc) => {
              const updatedAt = moment(doc.updatedAt);
              const createdAt = moment(doc.createdAt);

              return {
                onClick: () => router.push(`/docs/${doc.id}`),
                id: doc.id,
                icon: (
                  <CustomAvatarGroup users={doc.authors} avatarGroupProps={{ max: 1 }} />
                ),
                primary: doc.title,
                secondary:
                  'Created on ' +
                  createdAt.format('DD/MM/YY') +
                  ' (updated ' +
                  updatedAt.fromNow() +
                  ')',
                tertiary: doc.tags.map(({ label, color }) => (
                  <Tag bgColor={color}>{label}</Tag>
                )),
                action: (
                  <Menu placement="left-start" offset={[0, 0]}>
                    <MenuButton
                      as={IconButton}
                      aria-label="task options button"
                      variant="ghost"
                      icon={<BiDotsVerticalRounded />}
                    ></MenuButton>
                    <MenuList w="30px">
                      <MenuItem>
                        <MdEdit /> <Text pl="4px">Edit</Text>
                      </MenuItem>
                      {/* <ControllerWrapper model="project" query="delete">
                      {({ mutateAsync: deleteProject }) => (
                        <MenuItem onClick={() => deleteProject({ id: p.id })}>
                          <AiFillDelete />
                          <Text pl="4px">Delete</Text>
                        </MenuItem>
                      )}
                    </ControllerWrapper> */}
                    </MenuList>
                  </Menu>
                ),
              };
            })}
          ></List>
        )
      )}
    </Box>
  );
}
