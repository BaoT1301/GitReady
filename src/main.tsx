import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const storedTheme = localStorage.getItem('gitready_theme')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const resolvedTheme =
  storedTheme === 'light' || storedTheme === 'dark'
    ? storedTheme
    : prefersDark
      ? 'dark'
      : 'light'

document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
