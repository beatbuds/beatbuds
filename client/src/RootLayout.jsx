import Nav from './components/Nav.jsx'
import { Outlet } from 'react-router-dom'
import './styling/page-layout.css'

function RootLayout() {

  return (
    <>
    <div className="page-layout">
      <div className="nav-layout">
        <Nav />
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
    </>
  );
}

export default RootLayout;
