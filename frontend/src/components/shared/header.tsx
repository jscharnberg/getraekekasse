import './header.css';

function Header() {
    const onLogout = () => {
        localStorage.removeItem('jwt');
        window.location.href = '/login';
    }

    return (
        <div className="header">
            <h1 className="header-title">Meine App</h1>
            <button className="logout-button" onClick={onLogout}>Logout</button>
        </div>
    );
}

export default Header;
