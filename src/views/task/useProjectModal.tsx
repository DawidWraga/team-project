import { projectController } from 'lib-client/controllers';
import { useChakraForm } from 'lib-client/hooks/useChakraForm';
import { ProjectModel } from 'prisma/zod';
import { useModalStore } from 'lib-client/stores/ModalStore';
import { FormHeading } from 'components/FormHeading';

interface IProps {
  onClose: () => void;
}

const ProjectModalBody = (props: IProps) => {
  const { mutateAsync: createProject } = projectController.useMutation('create', {});

  const { Form, Input, SubmitBtn, DebugPanel } = useChakraForm({
    schema: ProjectModel.pick({ title: true, dueDate: true }),
    defaultValues: {
      title: 'title1',
      dueDate: new Date(),
    },
  });

  return (
    <Form onSubmit={createProject} onServerSuccess={props.onClose}>
      <DebugPanel />
      <Input name="title" />
      <Input name="dueDate" type="date" />
      <SubmitBtn w="100%">Create project</SubmitBtn>
    </Form>
  );
};

export const useProjectModal = () => {
  const { setContent, onClose } = useModalStore();

  const openProjectModal = () =>
    setContent &&
    setContent({
      header: <FormHeading>Create new project</FormHeading>,
      body: <ProjectModalBody onClose={onClose} />,
    });

  return { openProjectModal };
};
