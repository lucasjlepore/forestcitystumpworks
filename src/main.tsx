import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SettingsProvider } from './settings-context'
import { JobProvider } from './job-context'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <JobProvider>
        <App />
      </JobProvider>
    </SettingsProvider>
  </StrictMode>,
)
