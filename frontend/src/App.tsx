import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Adminpage } from "./components/adminpage/admin.tsx";
import { Login } from "./components/login/login.tsx";
import { Mainpage } from "./components/mainpage/mainpage.tsx";

function App() {
  return (
    <div className="w-screen h-screen bg-red-300">
      <Routes>
        <Route path='/login' element={<Login />}></Route>
        <Route path='admin' element={<Adminpage />} />
        <Route path='/' element={<Mainpage />} />
      </Routes>
    </div>
  );
}

export default App;
