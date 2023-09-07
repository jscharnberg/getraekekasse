import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginButton() {
    const [userId, setUserId] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const requestBody = JSON.stringify({ UserId: Number(userId) });
            const apiUrl = 'http://localhost:8080/user/login';

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody,
            });

            if (response.ok) {
                const data = await response.json();
                if (data.token !== undefined) {
                    localStorage.setItem('jwt', String(data.token));
                    setLoginSuccess(true);
                }
            } else {
                console.error('Fehler beim Senden der Anfrage:', response.statusText);
            }
        } catch (error) {
            console.error('Fehler beim Senden der Anfrage:', error);
        }
    };

    useEffect(() => {
        if (loginSuccess) {
            window.location.href = '/main';
            //navigate('https://www.google.com');
        }
    }, [loginSuccess, navigate]);

    return (
        <div>
            <input
                type="number"
                placeholder="Geben Sie Ihre ID ein"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            <br /><br />
            <button
                className="py-2 px-4 bg-gray-700 text-white mb-5"
                onClick={handleLogin}>
                LOGIN
            </button>
        </div>
    );
}

export default LoginButton;
