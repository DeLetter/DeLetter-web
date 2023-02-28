import React, { useState } from 'react'
import dynamic from 'next/dynamic'

type QuillTextProps = {
  value: string
  onChange: (value: string) => void
}

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
}

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'link',
  'image',
]

const QuillText = ({ value, onChange }: QuillTextProps) => {
  return (
    <>
      <QuillNoSSRWrapper
        placeholder="Enter your Email here..."
        theme="snow"
        modules={modules}
        formats={formats}
        value={value}
        onChange={onChange}
      />
    </>
  )
}

export default QuillText
