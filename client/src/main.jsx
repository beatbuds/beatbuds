// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import RootLayout from './RootLayout.jsx'
import App from './App.jsx' // This is your Home Page
import LoginPage from './pages/LoginPage.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'
import Communities from './pages/Communities.jsx'
import MusicPlayer from './pages/MusicPlayer.jsx'
import Fyp from './pages/Fyp.jsx'
import CallbackPage from './pages/Callback.jsx'
import LoginPageSB from './pages/LoginPageSB.jsx'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <App /> },
      { path: "/MusicPlayer", element: <MusicPlayer /> },
      { path: "/Profile", element: <Profile /> },
      { path: "/Settings", element: <Settings /> },
      { path: "/Communities", element: <Communities /> },
      { path: "/Fyp", element: <Fyp /> },
    ],
  },
  { path: "/LoginPage", element: <LoginPage /> },
  { path: "/LoginPageSB", element: <LoginPageSB /> },
  { path: "/callback", element: <CallbackPage /> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)