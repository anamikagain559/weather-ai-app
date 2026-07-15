import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'

// Clear any invalid legacy "dummy_token" stored from previous sessions
const storedToken = localStorage.getItem('token');
if (!storedToken || storedToken === 'dummy_token') {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
