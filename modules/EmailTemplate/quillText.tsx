import dynamic from 'next/dynamic'

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
  value: {},
  onchange: () => {},
})

export default QuillNoSSRWrapper
