import React, { useState } from 'react';

function LoginButton() {
    const [userId, setUserId] = useState('');

    const handleLogin = () => {
        // Erstellen Sie einen JSON-Objekt mit der ID im Request-Body
        const requestBody = JSON.stringify({ UserId: Number(userId) });

        // Definieren Sie die URL Ihrer API-Endpunkts
        const apiUrl = 'http://localhost:8080/user/login'; // Ersetzen Sie dies durch die tatsächliche URL Ihrer API

        // Senden Sie die POST-Anfrage an die API
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: requestBody,
        })
            .then((response) => response.json())
            .then((data) => {
                // Hier können Sie mit der Antwort von der API arbeiten
                console.log('API-Antwort:', data);
                const token = data.token;
                localStorage.setItem('jwt', token);
            })
            .catch((error) => {
                console.error('Fehler beim Senden der Anfrage:', error);
            });
    };

    return (
        <div>
            <input
                type="number"
                placeholder="Geben Sie Ihre ID ein"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default LoginButton;
