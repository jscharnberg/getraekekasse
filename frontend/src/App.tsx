import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { AdminLoginPage } from "./components/adminLogin/adminLogin.tsx";
import { Login } from "./components/login/login.tsx";
import { Mainpage } from "./components/mainpage/mainpage.tsx";
import Adminpage from './components/adminPage/adminpage.tsx';
import { UserManagementPage } from './components/userManagement/userManagementPage.tsx';
import { useEffect } from 'react';
import { ItemManagementPage } from './components/itemManagement/itemManagement.tsx';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/admin') && currentPath.endsWith('/admin')) {
      navigate('/admin/user', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="w-screen h-screen bg-[#f0f0f0]">
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/admin/login' element={<AdminLoginPage />} />
        <Route path='/' element={<Mainpage />} />
        <Route path='/admin/user' element={<UserManagementPage />} />
        {<Route path='/admin/items' element={<ItemManagementPage />} />}
      </Routes>
    </div>
  );
}
export default App;
