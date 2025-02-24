import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from 'antd'
import Example from "./App"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App>
      <Example />
    </App>
  </StrictMode>,
)
