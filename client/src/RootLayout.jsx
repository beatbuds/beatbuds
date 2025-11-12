import Nav from './components/Nav.jsx'
import { Outlet } from 'react-router-dom'
import './styling/page-layout.css'

function RootLayout() {

  return (
    <>
    <div class="page-layout">
      <div class="nav-layout">
        <Nav />
      </div>
      <div class="main-content">
        <Outlet />
      </div>
    </div>
    </>
  );
}

export default RootLayout;
