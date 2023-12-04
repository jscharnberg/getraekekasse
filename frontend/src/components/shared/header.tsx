// Header.tsx
import './header.css';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
    isAdminPage?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isAdminPage = false }) => {
    const onLogout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('adminToken');
        window.location.href = '/login';
    };

    const location = useLocation();

    if (isAdminPage) {
        return (
            <div className="header bg-[#343a40]">
                {/* <div className="container mx-auto flex justify-between items-center"> */}
                <h1 className="header-title text-white">Getränkekasse - Admin</h1>
                <nav className="mr-auto ml-20">
                    <ul className="flex space-x-4">
                        <li>
                            <Link to="/admin/user" className={location.pathname === '/admin/user' ? 'admin-link active' : 'admin-link'}>Benutzer</Link>
                        </li>
                        <li>
                            <Link to="/admin/items" className={location.pathname === '/admin/items' ? 'admin-link active' : 'admin-link'}>Artikel</Link>
                        </li>
                    </ul>
                </nav>
                <button className="logout-button text-white" onClick={onLogout}>Logout</button>
                {/* </div> */}
            </div>
        );
    }

    return (
        <div className="header bg-[#343a40]">
            <h1 className="header-title text-white">Getränkekasse</h1>
            <button className="logout-button text-white" onClick={onLogout}>Logout</button>
        </div>
    );
};

export default Header;
