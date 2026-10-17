import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './style.css'

const mount = document.getElementById('root')
if (!mount) throw new Error('Missing root element')
createRoot(mount).render(
  <React.StrictMode><App /></React.StrictMode>
)
