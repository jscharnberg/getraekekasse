// loginButton.tsx
import React, { useState } from 'react';

const LoginButton = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:8080/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.status === 200) {
                const data = await response.json();
                // Speichere den JWT-Token als Cookie mit dem Namen "adminToken"
                //document.cookie = `adminToken=${data.token}`;
                localStorage.setItem('adminToken', String(data.token));
                console.log('Login erfolgreich!');
                window.location.href = '/admin';
            } else {
                console.log('Login fehlgeschlagen');
            }
        } catch (error) {
            console.error('Fehler beim Login:', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Benutzername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={handleLogin}>
                Einloggen
            </button>
        </div>
    );
};

export default LoginButton;
