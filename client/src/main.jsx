import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route, Link, createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './App.jsx'
import LoginPage from './pages/LoginPage.jsx'
import MusicPlayer from './pages/MusicPlayer.jsx'

const router = createBrowserRouter([
  {path:"/",element:<App />},
  {path:"/LoginPage",element:<LoginPage />},
  {path:"/MusicPlayer",element:<MusicPlayer />},
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
