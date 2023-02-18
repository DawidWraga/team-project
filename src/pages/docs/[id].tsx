import { controller } from 'lib-client/controllers';
import { useUrlData } from 'lib-client/hooks/useUrlData';
import { Button, Flex, Heading, IconButton, Spacer, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Paper } from 'components/Paper';
import { PageWrapper } from 'layouts/PageWrapper';
import moment from 'moment/moment';
import { MdArrowLeft, MdShare } from 'react-icons/md';
import { toast } from 'react-toastify';
import { Loader, EmptyState } from '@saas-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { CustomAvatarGroup } from 'components/CustomAvatarGroup';
import { useIsHydrated } from 'lib-client/hooks/useIsHydrated';

interface IProps {}

export default function SingleDocumentPage(props: IProps) {
  const {} = props;

  const isHydrated = useIsHydrated();
  const router = useRouter();
  const { id: docId } = useUrlData('dynamicPath');

  const { data: doc, isLoading } = controller.useQuery({
    model: 'document',
    query: 'findUnique',
    prismaProps: {
      id: docId,
    },
    enabled: Boolean(docId),
  });

  if (isLoading) return <Loader />;

  if ((isHydrated && !docId) || !doc.id) return <EmptyDocState />;

  return (
    <>
      <PageWrapper>
        <Paper
          as="article"
          variant="elevated"
          p="5"
          flexDir="column"
          gap="8"
          position="relative"
        >
          <IconButton
            aria-label="back to docs"
            icon={<MdArrowLeft />}
            top={2}
            left={2}
            position="absolute"
            onClick={() => router.back()}
          />
          <Button
            onClick={() => {
              navigator.clipboard.writeText('makeitall.vercel.app' + router.asPath);
              toast.success('Link copied!');
            }}
            leftIcon={<MdShare />}
            position="absolute"
            top="2"
            right="2"
          >
            Share
          </Button>
          <Heading mx="auto" size="lg" mt="5">
            {doc.title}
          </Heading>
          <Spacer w="100%" h="1" border="1px solid gray" />
          <Flex alignItems="center" justifyContent={'space-between'}>
            <Flex alignItems="center" gap="1">
              <CustomAvatarGroup users={doc.authors} />
              {/* <Avatar src={doc.author.img} w="2rem" h="2rem" /> */}
              {/* <Text fontSize="1.2rem" fontWeight="semibold">
                {doc.author.name}
              </Text> */}
            </Flex>
            <Text>{moment(doc.date).format('DD/MM/YYYY')}</Text>
          </Flex>
          <div
            dangerouslySetInnerHTML={{
              __html: doc.content,
            }}
          ></div>
        </Paper>
      </PageWrapper>
    </>
  );
}

const EmptyDocState = () => {
  const router = useRouter();
  return (
    <EmptyState
      colorScheme="brand"
      icon={QuestionOutlineIcon}
      title="Doc not found"
      description="Please check the URL and try again."
      spacing={0}
      sx={{
        '& .saas-empty-state__body': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        },
      }}
      actions={
        <>
          <Button colorScheme="brand" onClick={() => router.push('/dashboard')}>
            Home
          </Button>
          <Button onClick={() => router.back()}>Back</Button>
        </>
      }
    />
  );
};

/**
 * credit: https://gist.github.com/chrisveness/bcb00eb717e6382c5608
 *
 * Decodes utf-8 encoded string back into multi-byte Unicode characters.
 *
 * Can be achieved JavaScript by decodeURIComponent(escape(str)),
 * but this approach may be useful in other languages.
 *
 * @param   {string} utf8String - UTF-8 string to be decoded back to Unicode.
 * @returns {string} Decoded Unicode string.
 */
function utf8Decode(utf8String) {
  if (typeof utf8String != 'string')
    throw new TypeError('parameter ‘utf8String’ is not a string');
  // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
  const unicodeString = utf8String
    .replace(
      /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, // 3-byte chars
      function (c) {
        // (note parentheses for precedence)
        var cc =
          ((c.charCodeAt(0) & 0x0f) << 12) |
          ((c.charCodeAt(1) & 0x3f) << 6) |
          (c.charCodeAt(2) & 0x3f);
        return String.fromCharCode(cc);
      }
    )
    .replace(
      /[\u00c0-\u00df][\u0080-\u00bf]/g, // 2-byte chars
      function (c) {
        // (note parentheses for precedence)
        var cc = ((c.charCodeAt(0) & 0x1f) << 6) | (c.charCodeAt(1) & 0x3f);
        return String.fromCharCode(cc);
      }
    );
  return unicodeString;
}
