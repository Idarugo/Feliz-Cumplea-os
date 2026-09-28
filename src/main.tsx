import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { EditorApp } from './EditorApp.tsx'

const isEditorRoute = window.location.pathname.startsWith('/editor')

function Root() {
  if (isEditorRoute) {
    if (!import.meta.env.DEV) {
      return (
        <div className="flex min-h-screen items-center justify-center px-8 text-center font-sans text-blush-600">
          El editor solo está disponible en desarrollo local (npm run dev).
        </div>
      )
    }
    return <EditorApp />
  }
  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
