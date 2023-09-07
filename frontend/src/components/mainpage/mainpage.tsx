import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../shared/header';

export const Mainpage = () => {
    // Die Funktion, die du aufrufen möchtest
    const init = async () => {
        try {
            console.log(localStorage.getItem('jwt') != null);

            if (localStorage.getItem('jwt') != null) {
                const jwt = localStorage.getItem("jwt");
                const apiUrl = `http://localhost:8080/user/${jwt}`;

                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();

                } else {
                    console.error('Fehler beim Senden der Anfrage:', response.statusText);
                }
            } else {
                window.location.href = '/login';
            }

        } catch (error) {
            console.error('Fehler beim Senden der Anfrage:', error);
        }
    };

    useEffect(() => {
        // Hier rufst du deine Funktion auf, wenn die Mainpage geladen wird
        init();
    }, []); // Das leere Array sorgt dafür, dass dieser Effekt nur einmal nach dem Rendern ausgeführt wird

    return (
        <div>
            <Header />
            Moin i bins, Main
        </div>
    );
};
