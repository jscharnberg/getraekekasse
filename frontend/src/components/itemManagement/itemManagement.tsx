import { useEffect, useState } from "react";
import Header from "../shared/header"

interface ItemData {
    _id: string;
    itemname: string;
    stock: number;
    price: number;
}

export const ItemManagementPage: React.FC = () => {
    const [itemData, setItemData] = useState<ItemData[]>([]);

    const [showPopup, setShowPopup] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);
    // const [editedFirstName, setEditedFirstName] = useState('');
    // const [editedLastName, setEditedLastName] = useState('');

    const [originalItemData, setOriginalItemData] = useState<ItemData | null>(null);
    const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);

    const [editedItemName, setEditedItemName] = useState('');
    const [editedItemStock, setEditedItemStock] = useState(0);
    const [editedItemPrice, setEditedItemPrice] = useState(0);
    const [amountToAdd, setAmountToAdd] = useState<number>(0);
    const [newStock, setNewStock] = useState<number | null>(null);

    if (localStorage.getItem('adminToken') != null) {

        useEffect(() => {
            getAllItemData();
            // if (selectedUser) {
            //     saveOriginalData(selectedUser);
            // }
        }, []);
        // }, [selectedUser]);

        const getAllItemData = async () => {
            try {
                const usersUrl = 'http://localhost:8080/items';

                const response = await fetch(usersUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data: ItemData[] = await response.json();
                    setItemData(data);

                } else {
                    console.error('Fehler beim Senden der Anfrage für alle Items:', response.statusText);
                }
            } catch (error) {
                console.error('Fehler beim Senden der Anfrage:', error);
            }
        };

        const addNewItem = async (itemData: ItemData) => {
            try {
                const response = await fetch('http://localhost:8080/items', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(itemData),
                });

                if (response.ok) {
                    console.log('Neuer Artikel hinzugefügt');
                    getAllItemData();
                } else {
                    console.error('Fehler beim Hinzufügen des neuen Arikels:', response.statusText);
                }
            } catch (error) {
                console.error('Fehler beim Senden der Anfrage:', error);
            }
        };

        const patchItemData = async (itemData: ItemData) => {
            try {
                const itemDataUrl = `http://localhost:8080/items/${itemData._id}`;

                const response = await fetch(itemDataUrl, {
                    method: 'PATCH', // Verwende die PATCH-Methode für partielle Updates
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(itemData), // Sende die aktualisierten Arikteldaten
                });

                if (response.ok) {
                    console.log(`Artikel mit der ID ${itemData._id} wurde aktualisiert`);
                    getAllItemData(); // Lade die Artikeldaten neu
                } else {
                    console.error('Fehler beim Senden der PATCH-Anfrage:', response.statusText);
                }
            } catch (error) {
                console.error('Fehler beim Senden der Anfrage:', error);
            }
        };

        const handleDelete = async (id: string) => {
            // Hier kannst du die Logik für das Löschen des Benutzers implementieren
            // Zum Beispiel könntest du eine DELETE-Anfrage an deine API senden und die ID übergeben
            console.log(`Benutzer mit der ID ${id} wird gelöscht`);

            try {
                const userDataUrl = `http://localhost:8080/items/${id}`;

                const response = await fetch(userDataUrl, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    console.log(`Item mit der ID ${id} wurde gelöscht`);
                    getAllItemData(); // Lade die Artikeldaten neu
                } else {
                    console.error('Fehler beim Senden der Anfrage für die User Daten:', response.statusText);
                }

            } catch (error) {
                console.error('Fehler beim Senden der Anfrage:', error);
            }
        };

        // Funktion zum Öffnen des Popups und Setzen des ausgewählten Benutzers
        const openEditPopup = (item?: ItemData) => {
            const emptyItem: ItemData = {
                _id: '',
                itemname: '',
                stock: 0,
                price: 0,
            };

            setSelectedItem(item ? { ...item } : { ...emptyItem });
            setEditedItemName(item ? item.itemname : '');
            setEditedItemStock(item ? item.stock : 0);
            setEditedItemPrice(item ? item.price : 0);
            // setEditedLastName(user ? user.lastname : '');
            setShowPopup(true);
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

        const changePrice = (amount: number) => {
            if (selectedItem) {
                setAmountToAdd(amount);
                setNewStock((prevStock) => {
                    if (prevStock !== null) {
                        return prevStock + amount;
                    }

                    return selectedItem.stock + amount;
                });
                setAmountToAdd(0);
            }
        };

        const confirmEdit = () => {
            if (selectedItem !== null) {
                const updatedItemData = {
                    ...selectedItem,
                    itemname: editedItemName,
                    price: editedItemPrice,
                };

                if (newStock !== null) {
                    updatedItemData.stock = newStock;
                }

                if (selectedItem._id === '') {
                    // Wenn die ID des ausgewählten Benutzers leer ist, füge einen neuen Benutzer hinzu
                    addNewItem(updatedItemData);
                } else {
                    // Andernfalls aktualisiere die Daten des vorhandenen Benutzers
                    const updatedItemData = { ...selectedItem }; // Kopiere die ausgewählten Benutzerdaten

                    updatedItemData.itemname = editedItemName;
                    updatedItemData.price = editedItemPrice;

                    if (newStock !== null) {
                        updatedItemData.stock = newStock;
                    }

                    patchItemData(updatedItemData);
                }
                setShowPopup(false);
                resetData();


            }
        };

        const cancelEdit = () => {
            handleClosePopup(); // Funktion zum Schließen des Popups aufrufen
        };

        const resetData = () => {
            setSelectedItem(originalItemData); // Setze die Daten auf die ursprünglichen Daten zurück
            setNewStock(null);
            setAmountToAdd(0);

            setUnsavedChanges(false); // Setze den Zustand für ungespeicherte Änderungen zurück
        };

        return (
            <div>
                <Header isAdminPage />

                <div className='container w-[350px] md:w-[550px] lg:w-[750px] mx-auto mt-8'>
                    <table className="table-auto w-full bg-gray-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Artikel</th>
                                <th className="px-4 py-2">Vorrätig</th>
                                <th className="px-4 py-2">Preis</th>
                                <th className="px-4 py-2">Aktionen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itemData.length > 0 ? (
                                itemData.map(item => (
                                    <tr key={item._id}>
                                        <td className="border-t px-4 py-2 text-center border-black">{item.itemname}</td>
                                        <td className="border-t px-4 py-2 text-center border-black">{item.stock}</td>
                                        <td className="border-t px-4 py-2 text-center border-black">{item.price} €</td>
                                        <td className="border-t px-4 py-2 text-center border-black">
                                            {/* Hier wird der Button hinzugefügt */}
                                            <button
                                                onClick={() => openEditPopup(item)}
                                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
                                            >
                                                Bearbeiten
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-10"
                                            >
                                                Löschen
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="border-t px-4 py-2 text-center border-black" colSpan={3}>Keine Artikeldaten verfügbar</td>
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
                            Artikel hinzufügen
                        </button>
                    </div>

                    {showPopup && selectedItem && (
                        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
                            <div className="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
                                <div className="bg-white p-8 rounded shadow-lg">
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="editItemName">
                                            Artikel
                                        </label>
                                        <input
                                            id="editItemName"
                                            type="text"
                                            value={editedItemName}
                                            onChange={(e) => setEditedItemName(e.target.value)}
                                            className="border border-gray-400 p-2 rounded w-full"
                                        />
                                    </div>
                                    {/* <div className="mb-4">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="editItemName">
                                            Vorrätig
                                        </label>
                                        <input
                                            type="number"
                                            value={editedItemStock}
                                            onChange={(e) => setEditedItemStock(parseInt(e.target.value))}
                                            placeholder="Vorrätig"
                                            className="border border-gray-400 p-2 rounded w-full"
                                        />
                                    </div> */}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="editItemName">
                                            Preis in €
                                        </label>
                                        <input
                                            type="number"
                                            value={editedItemPrice}
                                            onChange={(e) => setEditedItemPrice(Number(e.target.value))}
                                            placeholder="Preis"
                                            className="border border-gray-400 p-2 rounded w-full"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="editItemStock">
                                            Aktueller Bestand: {newStock !== null ? newStock : selectedItem.stock}
                                        </label>
                                        <div className="flex items-center">
                                            <input
                                                type="number"
                                                value={amountToAdd !== 0 ? amountToAdd : ''}
                                                onChange={(e) => setAmountToAdd(Number(e.target.value))}
                                                placeholder="Bestand ändern"
                                                className="border border-gray-400 p-2 rounded mr-2"
                                            />
                                            <button
                                                onClick={() => changePrice(amountToAdd)}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                            >
                                                Hinzufügen
                                            </button>
                                            <button
                                                onClick={() => changePrice(-amountToAdd)}
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
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded ml-36"
                                        >
                                            Abbrechen
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>)
    } else {
        window.location.href = '/admin/login';
        return null;
    }
};