import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route, Link, createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import Profile from './pages/profile.jsx';


const router = createBrowserRouter([
  {path:"/",element:<App />},
  {path:"/LoginPage",element:<LoginPage />},
  {path: "/profile", element: <Profile />}
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
