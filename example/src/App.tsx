import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import DocsLayout from "./components/_layout"

function Example() {
  const [count, setCount] = useState(0)

  return (
    <>
      <DocsLayout />
    </>
  )
}

export default Example
