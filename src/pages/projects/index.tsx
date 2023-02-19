import { IconButton, Text, Box, Flex, Button } from '@chakra-ui/react';
import { controller } from 'lib-client/controllers';
import { MenuButton, Menu, MenuList, MenuItem } from '@chakra-ui/react';
import { AiFillDelete } from 'react-icons/ai';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { ControllerWrapper } from 'lib-client/controllers/ControllerWrapper';
import { Avatar } from '@chakra-ui/react';
import { List, Loading, SearchInput } from '@saas-ui/react';
import moment from 'moment';
import { MdEdit } from 'react-icons/md';
import { useProjectModal } from 'views/task/useProjectModal';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getDateParams } from 'utils/getDateParams';
import { CustomAvatarGroup } from 'components/CustomAvatarGroup';
import { useUser } from 'lib-client/hooks/useUser';
import { useLayoutStore } from 'lib-client/stores/LayoutStore';

interface IProps {}

export default function ProjectsPage(props: IProps) {
  const {} = props;
  const router = useRouter();
  const user = useUser();
  const { openProjectModal } = useProjectModal();

  const { useSetOptionBar } = useLayoutStore();
  useSetOptionBar(
    user.isEmp ? (
      <></>
    ) : (
      <Flex w="100%" px={2}>
        <Button
          aria-label="add project"
          ml="auto"
          colorScheme={'brand'}
          onClick={(ev) => {
            ev.stopPropagation();
            openProjectModal({});
          }}
        >
          add project
        </Button>
      </Flex>
    ),
    []
  );

  const [searchTerm, setSearchTerm] = useState('');

  const { data: projects, isLoading } = controller.useQuery({
    model: 'project',
    query: 'findMany',
    prismaProps: {
      include: {
        assignees: true,
        statuses: true,
      },
    },
    select: (d) =>
      d.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase())),
  });

  return (
    <Box p={1}>
      <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      {isLoading ? (
        <Loading />
      ) : (
        projects && (
          <List
            items={projects.map((p) => ({
              onClick: () => router.push(`/projects/${p.id}/tasks?${getDateParams()}`),
              id: p.id,
              icon: <Avatar size="sm" name={p.title} />,
              primary: p.title,
              secondary: 'Due ' + moment(p.dueDate).format('MMMM Do YYYY'),
              tertiary: (
                <>
                  <CustomAvatarGroup users={p.assignees} />
                </>
              ),
              action: (
                <Menu placement="left-start" offset={[0, 0]}>
                  <MenuButton
                    as={IconButton}
                    aria-label="task options button"
                    variant="ghost"
                    icon={<BiDotsVerticalRounded />}
                  ></MenuButton>
                  <MenuList w="30px">
                    <MenuItem
                      onClick={() => {
                        openProjectModal(p);
                      }}
                    >
                      <MdEdit /> <Text pl="4px">Edit</Text>
                    </MenuItem>
                    <ControllerWrapper model="project" query="delete">
                      {({ mutateAsync: deleteProject }) => (
                        <MenuItem onClick={() => deleteProject({ id: p.id })}>
                          <AiFillDelete />
                          <Text pl="4px">Delete</Text>
                        </MenuItem>
                      )}
                    </ControllerWrapper>
                  </MenuList>
                </Menu>
              ),
            }))}
          ></List>
        )
      )}
    </Box>
  );
}
