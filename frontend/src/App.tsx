import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Adminpage } from "./components/adminpage/admin.tsx";
import { Login } from "./components/login/login.tsx";
import { Mainpage } from "./components/mainpage/mainpage.tsx";
import Test from './components/login/test.tsx';

function App() {
  return (
    <div className="w-screen h-screen bg-red-300">
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/test' element={<Test />}></Route>
        <Route path='admin' element={<Adminpage />} />
        <Route path='main' element={<Mainpage />} />
      </Routes>
    </div>
  );
}

export default App;
