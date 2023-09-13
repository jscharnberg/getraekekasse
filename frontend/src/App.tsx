import './App.css'
import { Routes, Route } from 'react-router-dom'
import { AdminLoginPage } from "./components/adminLogin/adminLogin.tsx";
import { Login } from "./components/login/login.tsx";
import { Mainpage } from "./components/mainpage/mainpage.tsx";

function App() {
  return (
    <div className="w-screen h-screen bg-[#f0f0f0]">
      <Routes>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/admin/login' element={<AdminLoginPage />} />
        <Route path='/' element={<Mainpage />} />
      </Routes>
    </div>
  );
}

export default App;
