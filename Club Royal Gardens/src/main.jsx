import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Miembros from './Miembros.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Miembros />
  </StrictMode>,
)
