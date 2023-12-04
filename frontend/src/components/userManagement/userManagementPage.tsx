import { useEffect, useRef, useState, MouseEvent } from "react";
import Header from "../shared/header";

interface UserData {
    id: string;
    userid: number;
    firstname: string;
    lastname: string;
    accbalance: number;
}

export const UserManagementPage: React.FC = () => {
    const [usersData, setUsersData] = useState<UserData[]>([]);

    const [showPopup, setShowPopup] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [editedFirstName, setEditedFirstName] = useState('');
    const [editedLastName, setEditedLastName] = useState('');

    const [amountToAdd, setAmountToAdd] = useState<number>(0);
    const [newBalance, setNewBalance] = useState<number | null>(null);

    const [originalUserData, setOriginalUserData] = useState<UserData | null>(null);
    const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);

    const popupRef = useRef<HTMLDivElement>(null);

    if (localStorage.getItem('adminToken') != null) {
        const getAllUsersData = async () => {
            try {
                const usersUrl = 'http://localhost:8080/user';

                const usersResponse = await fetch(usersUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (usersResponse.ok) {
                    const data: UserData[] = await usersResponse.json();
                    setUsersData(data);
                } else {
                    console.error('Fehler beim Senden der Anfrage für alle Benutzer:', usersResponse.statusText);
                }
            } catch (error) {
                console.error('Fehler beim Senden der Anfrage:', error);
            }
        };

        const saveOriginalData = (data: UserData) => {
            setOriginalUserData({ ...data });
        };

        useEffect(() => {
            getAllUsersData();
            if (selectedUser) {
                saveOriginalData(selectedUser);
            }
        }, [selectedUser]);


        const resetData = () => {
            if (selectedUser && originalUserData) {
                setSelectedUser(originalUserData); // Setze die Daten auf die ursprünglichen Daten zurück
                setEditedFirstName(originalUserData.firstname);
                setEditedLastName(originalUserData.lastname);
                setNewBalance(null);
                setAmountToAdd(0);
            }
            setUnsavedChanges(false); // Setze den Zustand für ungespeicherte Änderungen zurück
        };

        // Funktion, die beim Schließen des Popups aufgerufen wird
        const handleClosePopup = () => {
            if (unsavedChanges) {
                const confirmClose = window.confirm('Es gibt ungespeicherte Änderungen. Möchtest du sie verwerfen?');
                if (confirmClose) {
                    setShowPopup(false); // Schließe das Popup und verwerfe die Änderungen
                    resetData();
                }
            } else {
                setShowPopup(false); // Schließe das Popup
                resetData();
            }
        };

        const handleDelete = async (id: string) => {
            // Hier kannst du die Logik für das Löschen des Benutzers implementieren
            // Zum Beispiel könntest du eine DELETE-Anfrage an deine API senden und die ID übergeben
            console.log(`Benutzer mit der ID ${id} wird gelöscht`);

            try {
                const userDataUrl = `http://localhost:8080/user/${id}`;

                const response = await fetch(userDataUrl, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    console.log(`Benutzer mit der ID ${id} wurde gelöscht`);
                    getAllUsersData(); // Lade die Benutzerdaten neu
                } else {
                    console.error('Fehler beim Senden der Anfrage für die User Daten:', response.statusText);
                }

            } catch (error) {
                console.error('Fehler beim Senden der Anfrage:', error);
            }
        };

        const changeBalance = (amount: number) => {
            if (selectedUser) {
                setAmountToAdd(amount);
                setNewBalance((prevBalance) => {
                    if (prevBalance !== null) {
                        return prevBalance + amount;
                    }
                    return selectedUser.accbalance + amount;
                });
                setAmountToAdd(0);
            }
        };

        // Funktion zum Öffnen des Popups und Setzen des ausgewählten Benutzers
        const openEditPopup = (user?: UserData) => {
            const emptyUser: UserData = {
                id: '',
                userid: 0,
                firstname: '',
                lastname: '',
                accbalance: 0,
            };

            setSelectedUser(user ? { ...user } : { ...emptyUser });
            setEditedFirstName(user ? user.firstname : '');
            setEditedLastName(user ? user.lastname : '');
            setShowPopup(true);
        };

        const cancelEdit = () => {
            handleClosePopup(); // Funktion zum Schließen des Popups aufrufen
        };

        const addNewUser = async (userData: UserData) => {
            try {
                console.log("test");

                const response = await fetch('http://localhost:8080/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });

                if (response.ok) {
                    console.log('Neuer Benutzer hinzugefügt');
                    getAllUsersData();
                } else {
                    console.error('Fehler beim Hinzufügen des neuen Benutzers:', response.statusText);
                }
            } catch (error) {
                console.error('Fehler beim Senden der Anfrage:', error);
            }
        };

        const patchUserData = async (userData: UserData) => {
            try {
                const userDataUrl = `http://localhost:8080/user/${userData.id}`;

                const response = await fetch(userDataUrl, {
                    method: 'PATCH', // Verwende die PATCH-Methode für partielle Updates
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData), // Sende die aktualisierten Benutzerdaten
                });

                if (response.ok) {
                    console.log(`Benutzer mit der ID ${userData.id} wurde aktualisiert`);
                    getAllUsersData(); // Lade die Benutzerdaten neu
                } else {
                    console.error('Fehler beim Senden der PATCH-Anfrage:', response.statusText);
                }
            } catch (error) {
                console.error('Fehler beim Senden der Anfrage:', error);
            }
        };

        const confirmEdit = () => {
            if (selectedUser !== null) {
                const updatedUserData = {
                    ...selectedUser,
                    firstname: editedFirstName,
                    lastname: editedLastName,
                };

                if (selectedUser.id === '') {
                    // Wenn die ID des ausgewählten Benutzers leer ist, füge einen neuen Benutzer hinzu
                    addNewUser(updatedUserData);
                } else {
                    // Andernfalls aktualisiere die Daten des vorhandenen Benutzers
                    const updatedUserData = { ...selectedUser }; // Kopiere die ausgewählten Benutzerdaten

                    updatedUserData.firstname = editedFirstName;
                    updatedUserData.lastname = editedLastName;

                    if (newBalance !== null) {
                        updatedUserData.accbalance = newBalance;
                    }
                    patchUserData(updatedUserData);
                }
                setShowPopup(false);
                resetData();
            }
        };


        return (
            <div>
                <Header isAdminPage />
                <div className='container w-[350px] md:w-[550px] lg:w-[750px] mx-auto mt-8'>
                    <table className="table-auto w-full bg-gray-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">User ID</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Kontostand</th>
                                <th className="px-4 py-2">Aktionen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersData.length > 0 ? (
                                usersData.map(user => (
                                    <tr key={user.id}>
                                        <td className="border-t px-4 py-2 text-center border-black">{user.userid}</td>
                                        <td className="border-t px-4 py-2 text-center border-black">{user.firstname} {user.lastname}</td>
                                        <td className={`border-t px-4 py-2 text-center border-black ${user.accbalance < 0 ? 'text-red-500' : ''}`}>
                                            {user.accbalance} €
                                        </td>
                                        <td className="border-t px-4 py-2 text-center border-black">
                                            {/* Hier wird der Button hinzugefügt */}
                                            <button
                                                onClick={() => openEditPopup(user)}
                                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
                                            >
                                                Bearbeiten
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-10"
                                            >
                                                Löschen
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="border-t px-4 py-2 text-center border-black" colSpan={3}>Keine Benutzerdaten verfügbar</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className='flex justify-center'>
                        <button
                            className={`mt-8 text-white bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
                            type="button"
                            onClick={() => openEditPopup()}
                        >
                            Benutzer hinzufügen
                        </button>
                    </div>

                    {showPopup && selectedUser && (
                        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
                            <div className="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
                                <div className="bg-white p-8 rounded shadow-lg">
                                    {/* Label und Textbox für den Vornamen */}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="editFirstName">
                                            Vorname
                                        </label>
                                        <input
                                            id="editFirstName"
                                            type="text"
                                            value={editedFirstName}
                                            onChange={(e) => setEditedFirstName(e.target.value)}
                                            className="border border-gray-400 p-2 rounded w-full"
                                        />
                                    </div>
                                    {/* Label und Textbox für den Nachnamen */}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="editLastName">
                                            Nachname
                                        </label>
                                        <input
                                            id="editLastName"
                                            type="text"
                                            value={editedLastName}
                                            onChange={(e) => setEditedLastName(e.target.value)}
                                            className="border border-gray-400 p-2 rounded w-full"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="editAccBalance">
                                            Aktueller Kontostand: {newBalance !== null ? newBalance : selectedUser.accbalance} €
                                        </label>
                                        <div className="flex items-center">
                                            <input
                                                type="number"
                                                value={amountToAdd !== 0 ? amountToAdd : ''}
                                                onChange={(e) => setAmountToAdd(Number(e.target.value))}
                                                placeholder="Betrag ändern"
                                                className="border border-gray-400 p-2 rounded mr-2"
                                            />
                                            <button
                                                onClick={() => changeBalance(amountToAdd)}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                            >
                                                Hinzufügen
                                            </button>
                                            <button
                                                onClick={() => changeBalance(-amountToAdd)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
                                            >
                                                Reduzieren
                                            </button>
                                        </div>
                                    </div>
                                    {/* Bestätigungs- und Abbruchbuttons */}
                                    <div className="flex justify-between">
                                        <button
                                            onClick={confirmEdit}
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
                                        >
                                            Bestätigen
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
                                        >
                                            Abbrechen
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        );
    } else {
        window.location.href = '/admin/login';
        return null;
    }
};
