import { Loader } from '@saas-ui/react';
import { useIsHydrated } from 'lib-client/hooks/useIsHydrated';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { ReactQuillProps } from 'react-quill';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <Loader />,
}) as any;

import 'react-quill/dist/quill.snow.css';

const toolbar_options = [
  [{ header: [1, 2, 3, 4, 5, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ align: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }],
  ['blockquote', 'code-block'],
  [{ indent: '-1' }, { indent: '+1' }],
  ['link', 'image'],
  // ['clean'],
];

interface IProps {
  quillProps?: ReactQuillProps;
}

export function QuillEditor(props: IProps) {
  const { quillProps } = props;
  const reactQuillRef = useRef<any>(null);

  const isHydrated = useIsHydrated();
  if (!isHydrated) return <Loader />;

  return (
    <ReactQuill
      ref={reactQuillRef as any}
      theme="snow"
      placeholder="Write here..."
      modules={{
        toolbar: {
          container: toolbar_options,
        },
      }}
      {...quillProps}
    />
  );
}
