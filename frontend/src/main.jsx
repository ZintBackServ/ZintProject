import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'  // ✅ already imported
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from "./context/AuthContext"

createRoot(document.getElementById('root')).render( // ✅ use createRoot directly
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)

