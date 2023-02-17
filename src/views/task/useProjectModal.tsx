import { ChakraForm, useChakraForm } from 'lib-client/hooks/useChakraForm';
import { ProjectModel } from 'prisma/zod';
import { useModalStore } from 'lib-client/stores/ModalStore';
import { FormHeading } from 'components/FormHeading';
import { z } from 'zod';
import { CustomEditable } from 'components/EditableInput';
import { Button, Divider, Flex, IconButton, Text } from '@chakra-ui/react';
import { UserSelect, multiUserOptionsSchema } from 'components/UserSelect';
import { getSchemaName } from 'lib-client/hooks/useDynamicSchema';
import { Project } from '@prisma/client';
import { MdSave } from 'react-icons/md';
import { getObjectDifference } from 'utils/getObjectDifference';
import { MinusIcon } from '@chakra-ui/icons';
import { controller } from 'lib-client/controllers';

// interface IProps {
//   onClose: () => void;
//   defaultValues?: Record<any, any>;
//   project?: Project;
// }

// const ProjectModalBody = ({ defaultValues, project, ...props }: IProps) => {

// };

const statusSchema = z.object({ label: z.string(), id: z.number().optional() });

export const useProjectModal = () => {
  const { setContent, onClose } = useModalStore();
  const { mutateAsync: createProject } = controller.use({
    query: 'upsert',
    model: 'project',
  });

  const openProjectModal = (project?: Partial<Project> & { id: number }) => {
    console.log('project', project);
    const isEditing = Boolean(project.id);

    return setContent({
      header: (
        <FormHeading>
          {project?.id ? `Edit ${project?.title}` : 'Create new project'}
        </FormHeading>
      ),
      body: (
        <ChakraForm
          schema={ProjectModel.pick({ title: true, dueDate: true }).extend({
            assignees: multiUserOptionsSchema,
          })}
          defaultValues={{
            title: 'title1',
            dueDate: new Date(),
            assignees: [{ fullName: 'Dawid Wraga', id: 5 }] as any,

            ...(!isEditing && {
              statuses: [{ label: 'todo' }, { label: 'in-progress' }, { label: 'done' }],
            }),
          }}
          dynamicSchemaNamesToObj={{ statuses: statusSchema }}
          updateValues={project}
          render={({ Input, SubmitBtn, InputList, updateSchema, Form, DebugPanel }) => (
            <Form
              onSubmit={({ assignees, ...data }: any) => {
                return createProject({
                  ...data,
                  ...(assignees?.length && {
                    assignees: assignees?.map((d) => ({ id: d.value })),
                  }),
                }).then(() => onClose());
              }}
              // onServerSuccess={onClose}
            >
              <DebugPanel />
              <Input name="title" />
              <Input name="dueDate" type="date" />
              <Input
                name="assignees"
                formControlProps={{
                  sx: {
                    '& > label': {
                      transition: 'all 200ms',
                    },
                    '&:not([data-floating-label]) > label': {
                      top: '2px !important',
                    },
                  },
                  className: isEditing && 'keep-floating-label',
                }}
                labelProps={{ sx: { position: 'relative', top: '2px !important' } }}
                customInput={(props) => {
                  // console.log(props.field);
                  return <UserSelect {...props} />;
                }}
              />
              <Flex alignItems="center" gap={2}>
                <Divider bgColor="shade.main" />
                <Text fontSize="lg">Statuses</Text>
                <Divider bgColor="shade.main" />
              </Flex>
              <InputList
                name="statuses"
                inputs={({ label }) => {
                  return (
                    <Flex gap={1}>
                      <Input
                        name={label}
                        hideLabel={true}
                        // customInput={({ defaults, field, fieldState }: any) => {
                        //   return (
                        //     <Flex alignItems="center" gap="1">
                        //       <Input />
                        //       {/* <CustomEditable
                        //         editableProps={{
                        //           ...defaults,
                        //           ...field,
                        //           defaultValue: field.value || ' ',
                        //           placeholder: 'Add new status...',
                        //           rounded: 'md',
                        //           shadow: 'sm',
                        //           position: 'relative',
                        //         }}
                        //       /> */}
                        //       <IconButton
                        //         aria-label="remove subtask"
                        //         icon={<MinusIcon fontSize="sm" />}
                        //         size="sm"
                        //         onClick={() => {
                        //           updateSchema.remove(label);
                        //         }}
                        //       />

                        //     </Flex>
                        //   );
                        // }}
                      />
                      <IconButton
                        aria-label="remove subtask"
                        icon={<MinusIcon fontSize="sm" />}
                        size="sm"
                        onClick={() => {
                          updateSchema.remove(label);
                        }}
                      />
                    </Flex>
                  );
                }}
              />
              <Button
                onClick={() => {
                  updateSchema.addObj('statuses', { label: z.string() });
                }}
              >
                Add status
              </Button>

              <SubmitBtn label="project" w="100%" />
            </Form>
          )}
        />
      ),
    });
  };
  return { openProjectModal };
};

// function processDefaultValues(d: any) {
//   const data = {
//     id: d.id,
//     title: d.title,
//     dueDate: new Date(d.dueDate),
//     assignees:
//       d.assignees &&
//       d.assignees.map(({ id, fullName }) => ({
//         value: id,
//         label: fullName,
//       })),
//   };

//   if (d.statuses)
//     d.statuses.forEach((status) => {
//       const schemaName = getSchemaName({
//         index: status.id,
//         objectName: 'status',
//         property: 'label',
//       });
//       data[schemaName] = status.label;
//     });

//   return data;
// }

// const {
//   Form,
//   Input,
//   SubmitBtn,
//   DebugPanel,
//   InputList,
//   updateSchema,
//   getValues,
//   // isEditing,
// } = useChakraForm();

// return (
//   <Form
//     onSubmit={({ status, assignees, ...data }: any) => {
//       // if(isEditing && JSON.parse(processedDefaults) !== JSON)

//       if (!isEditing) {
//         return createProject({
//           data: {
//             ...data,
//             statuses: {
//               create: status,
//             },
//             assignees: {
//               connect: assignees.map((d) => ({ id: d.value })),
//             },
//           },
//         });
//       }

//       // if (isEditing) {
//       //   console.log('editing submit');
//       //   const changesMade =
//       //     isEditing && getObjectDifference(processedDefaults, getValues());
//       //   if (Object.keys(changesMade).length < 1) return;

//       //   console.log('changes made: ', changesMade);

//       //   const { id } = data;
//       //   const { title, dueDate, changedAssignees, changedStatuses } = changesMade;

//       //   return updateProject({
//       //     where: { id },
//       //     data: {
//       //       dueDate,
//       //       title,
//       //       ...(assignees.length && {
//       //         assignees: {
//       //           // set: [],
//       //           connect: assignees.map((d) => ({ id: d.value })),
//       //         },
//       //       }),
//       //       ...(status.length && {
//       //         statuses: {
//       //           // set: [],
//       //           connect: status,
//       //         },
//       //       }),
//       //     },
//       //   });
//       // }
//     }}
//     // onServerSuccess={props.onClose}
//   >

//   </Form>
