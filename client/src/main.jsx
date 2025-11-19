// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import RootLayout from './RootLayout.jsx'
import LoginPage from './pages/LoginPage.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'
import Communities from './pages/Communities.jsx'
import MusicPlayer from './pages/MusicPlayer.jsx'
import Fyp from './pages/Fyp.jsx'
import NotFound from './pages/NotFound.jsx'
import CreatePost from './pages/CreatePost.jsx'
import CallbackPage from './pages/Callback.jsx'
import LoginPageSB from './pages/LoginPageSB.jsx'
import HomePage from './pages/HomePage.jsx'
import UserSearchPage from './pages/UserSearchPage.jsx'
import PostDetails from './pages/PostDetails.jsx'
import EditPost from './pages/EditPost.jsx'
import UserPage from './pages/UserPage.jsx'
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/MusicPlayer", element: <MusicPlayer /> },
      { path: "/Profile", element: <Profile /> },
      { path: "/Settings", element: <Settings /> },
      { path: "/Communities", element: <Communities /> },
      { path: "/UserSearchPage", element: <UserSearchPage /> },
      {path: "/CreatePost", element: <CreatePost />},
      {path: "*", element: <NotFound />},
      { path: "/post/:id", element: <PostDetails /> },
      { path: "/edit/:id", element: <EditPost /> },
      { path: "/Fyp", element: <Fyp /> },
      { path: "/user/:id", element: <UserPage /> },
      { path: "/HomePage", element: <HomePage /> },
      { path: "/", element: <HomePage /> },
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