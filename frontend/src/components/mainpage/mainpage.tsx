import { useEffect, useState } from 'react';
import Header from '../shared/header';
import { ObjectId } from 'bson';

export const Mainpage = () => {
    const [userData, setUserData] = useState<{ _id: ObjectId, userid: number, firstname: string; lastname: string; accbalance: number } | null>(null);
    const [itemsData, setItemsData] = useState<any[]>([]);
    const [counts, setCounts] = useState<number[]>([]);
    const [error, setError] = useState(null);
    const [data, setData] = useState({});

    // Die Funktion, die du aufrufen möchtest
    if (localStorage.getItem('jwt') != null) {
        const getItemData = async () => {
            try {
                const itemsDataUrl = `http://localhost:8080/items`;

                const itemsResponse = await fetch(itemsDataUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (itemsResponse.ok) {
                    const data = await itemsResponse.json();
                    setItemsData(data);

                    const initialCounts = Array(data.length).fill(0);
                    setCounts(initialCounts);

                } else {
                    console.error('Fehler beim Senden der Anfrage für die Item Daten:', itemsResponse.statusText);
                }

            } catch (error) {
                console.error('Fehler beim Senden der Anfrage:', error);
            }
        };

        const getUserData = async () => {
            try {
                const jwt = localStorage.getItem("jwt");
                const userDataUrl = `http://localhost:8080/user/${jwt}`;

                const userResponse = await fetch(userDataUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (userResponse.ok) {
                    const data = await userResponse.json();
                    setUserData(data);

                } else {
                    console.error('Fehler beim Senden der Anfrage für die User Daten:', userResponse.statusText);
                }

            } catch (error) {
                console.error('Fehler beim Senden der Anfrage:', error);
            }
        }

        const incrementCount = (index: number) => {
            const newCounts = [...counts];
            newCounts[index] += 1;
            setCounts(newCounts);
        };

        const decrementCount = (index: number) => {
            if (counts[index] > 0) {
                const newCounts = [...counts];
                newCounts[index] -= 1;
                setCounts(newCounts);
            }
        };

        const buyItems = () => {
            var purchasePrice = 0

            itemsData.forEach((item, index) => {
                updateItemStock(item, index);

                purchasePrice += item.price * counts[index];
            });

            updateAccBalance(purchasePrice);
        };

        const updateAccBalance = (purchasePrice: Number) => {
            const userUrl = `http://localhost:8080/user/update/${userData?._id}`

            const newUserAccBalance = Number(userData?.accbalance) - Number(purchasePrice)

            const patchData = {
                accbalance: newUserAccBalance // Hier gib den gewünschten Preiswert an
            };
            fetch(userUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    // Hier kannst du zusätzliche Header hinzufügen, z.B. für Authentifizierung
                },
                body: JSON.stringify(patchData),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((updatedData) => {
                    setData(updatedData);
                })
                .catch((error: any) => {
                    setError(error);
                });
        }

        const updateItemStock = (item: any, index: any) => {
            const itemUrl = `http://localhost:8080/items/update/${item._id}`;

            const patchData = {
                stockdec: counts[index] // Hier gib den gewünschten Preiswert an
            };
            fetch(itemUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    // Hier kannst du zusätzliche Header hinzufügen, z.B. für Authentifizierung
                },
                body: JSON.stringify(patchData),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((updatedData) => {
                    setData(updatedData);
                })
                .catch((error: any) => {
                    setError(error);
                });
        }

        useEffect(() => {
            // Hier rufst du deine Funktion auf, wenn die Mainpage geladen wird
            getUserData();
            getItemData();
        }, []); // Das leere Array sorgt dafür, dass dieser Effekt nur einmal nach dem Rendern ausgeführt wird

        return (
            <div>
                <Header />

                <h1 className='text-center'>
                    {userData && (
                        <>
                            {userData.firstname} {' '}
                            {userData.lastname}: {' '}
                            {userData.accbalance}
                        </>
                    )}
                </h1>

                <h1 className="text-2xl font-bold mb-4">Artikelliste</h1>
                <table className="table-auto border-collapse w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Artikelname</th>
                            <th className="px-4 py-2">Preis</th>
                            <th className="px-4 py-2">Aktionen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemsData.map((item, index) => (
                            <tr key={item._id}>
                                <td className="border px-4 py-2">{item.itemname}</td>
                                <td className="border px-4 py-2">{item.price}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        className={`${item.stock <= 0
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : counts[index] >= item.stock
                                                ? 'bg-gray-300'
                                                : 'bg-blue-500 hover:bg-blue-700'
                                            } text-white font-bold py-1 px-2 rounded`}
                                        onClick={() => incrementCount(index)}
                                        disabled={item.stock <= 0 || counts[index] >= item.stock}
                                    >
                                        +
                                    </button>
                                    <span className="px-2">{counts[index]}</span>
                                    <button
                                        className={`${item.stock <= 0
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : counts[index] <= 0
                                                ? 'bg-gray-300'
                                                : 'bg-red-500 hover:bg-red-700'
                                            } text-white font-bold py-1 px-2 rounded`}
                                        onClick={() => decrementCount(index)}
                                        disabled={item.stock <= 0 || counts[index] <= 0}
                                    >
                                        -
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button onClick={buyItems}>Test</button>
            </div>
        );
    } else {
        window.location.href = '/login';
    }
};
