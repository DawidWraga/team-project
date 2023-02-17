import { useRef, useState } from 'react';
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';

const toolbar_options = [
  [{ header: [1, 2, 3, 4, 5, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ align: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }],
  ['blockquote', 'code-block'],
  [{ indent: '-1' }, { indent: '+1' }],
  ['link'],
  // ['clean'],
];

export default function QuillEditor() {
  const [value, setValue] = useState();
  const reactQuillRef = useRef<ReactQuill>(null);

  return (
    <ReactQuill
      ref={reactQuillRef}
      theme="snow"
      placeholder="Write here..."
      modules={{
        toolbar: {
          container: toolbar_options,
        },
      }}
      value={value}
    />
  );
}
