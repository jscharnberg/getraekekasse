import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
            Moin i bins, Main
            <br /><br />
            <button
                onClick={() => {
                    localStorage.removeItem('jwt');
                    window.location.href = '/login';
                }}
                className="py-2 px-4 bg-gray-700 text-white mb-5"
            >
                Logout
            </button>
        </div>
    );
};
