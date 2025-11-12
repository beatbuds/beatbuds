import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route, Link, createBrowserRouter, RouterProvider } from 'react-router-dom'

import RootLayout from './RootLayout.jsx'
import App from './App.jsx'
import LoginPage from './pages/LoginPage.jsx'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <App /> },
      { path: "/LoginPage", element: <LoginPage /> },
      {path:"/Profile", element: <Element />},
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
