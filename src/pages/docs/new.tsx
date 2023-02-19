import { Box } from '@chakra-ui/react';
import { QuillEditor } from 'components/QuillEditor';
import { multiUserOptionsSchema } from 'components/UserSelect';
import { controller } from 'lib-client/controllers';
import { ChakraFormWrapper } from 'lib-client/hooks/useChakraForm';
import { useUser } from 'lib-client/hooks/useUser';
import { useRouter } from 'next/router';
import { DocumentModel } from 'prisma/zod';
import { useState } from 'react';
import { TagSelect } from 'views/docs/TagSelect';
import { z } from 'zod';

interface IProps {}

export default function NewPage(props: IProps) {
  const {} = props;
  const router = useRouter();

  const user = useUser();

  const { mutateAsync: createDocument } = controller.useMutation({
    model: 'document',
    query: 'create',
  });

  const [content, setContent] = useState('');

  return (
    <Box my="2">
      <ChakraFormWrapper
        schema={DocumentModel.pick({ title: true, content: true }).extend({
          tags: z.array(z.object({ label: z.string(), value: z.number() })),
        })}
      >
        {({ Form, Input, SubmitBtn }) => {
          return (
            <Form
              onSubmit={async (data) => {
                const doc = await createDocument({ ...data, authorId: user.id, content });

                router.push(`/docs/${doc.id}`);
              }}
              // w="clamp(300px, 100vw, 800px)"
              // width="750px !important"
              // maxW="unset"
              // sx={{ w: 'clamp(300px, 100vw, 800px)' }}
              sx={{ w: '1000px' }}
            >
              <Input name="title" />
              <Input name="tags" customInput={(props) => <TagSelect {...props} />} />
              <QuillEditor
                quillProps={{
                  value: content,
                  onChange: (value) => setContent(value),
                }}
              />
              <SubmitBtn label="document" />
            </Form>
          );
        }}
      </ChakraFormWrapper>
    </Box>
  );
}
