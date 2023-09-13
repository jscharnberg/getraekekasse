import { useEffect, useState } from 'react';
import Header from '../shared/header';
import { ObjectId } from 'bson';

export const Mainpage = () => {
    const [userData, setUserData] = useState<{ _id: ObjectId, userid: number, firstname: string; lastname: string; accbalance: number } | null>(null);
    const [itemsData, setItemsData] = useState<any[]>([]);
    const [counts, setCounts] = useState<number[]>([]);
    const [error, setError] = useState(null);
    const [data, setData] = useState({});
    const [showModal, setShowModal] = useState(false);

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

            logoutUser();
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

        const logoutUser = () => {
            localStorage.removeItem('jwt');
            window.location.href = '/login';
        }

        useEffect(() => {
            // Hier rufst du deine Funktion auf, wenn die Mainpage geladen wird
            getUserData();
            getItemData();
        }, []); // Das leere Array sorgt dafür, dass dieser Effekt nur einmal nach dem Rendern ausgeführt wird

        return (
            <div>
                <Header />
                <div className='container w-[350px] md:w-[550px] lg:w-[750px] mx-auto'>
                    <div className='grid grid-cols-2 text-2xl font-bold mb-5'>
                        <div>
                            <p>
                                {userData && (
                                    <>
                                        {userData.firstname} {' '}
                                        {userData.lastname}
                                    </>
                                )}
                            </p>
                        </div>
                        <div className='justify-self-end text-2xl font-bold'>
                            <p>
                                {userData && (
                                    <>
                                        Kontostand: {userData.accbalance} €
                                    </>
                                )}
                            </p>
                        </div>
                    </div>

                    <table className="table-auto w-full bg-gray-200">
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
                                    <td className="border-t px-4 py-2 text-center border-black">{item.itemname}</td>
                                    <td className="border-t px-4 py-2 text-center border-black">{item.price}</td>
                                    <td className="border-t px-4 py-2 text-center border-black">
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

                    <div className='flex justify-center'>
                        <button
                            className={`${counts.every(count => count < 1)
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-green-500'
                                } mt-8 text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
                            type="button"
                            onClick={() => setShowModal(true)}
                            disabled={counts.every(count => count < 1)}
                        >
                            Kauf abschließen
                        </button>
                    </div>
                    {showModal ? (
                        <>
                            <div
                                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                            >
                                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                    {/*content*/}
                                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                        {/*header*/}
                                        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                            <h3 className="text-3xl font-semibold">
                                                Abschluss
                                            </h3>
                                            <button
                                                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                                onClick={() => setShowModal(false)}
                                            >
                                                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                                    ×
                                                </span>
                                            </button>
                                        </div>
                                        {/*body*/}
                                        <div className="relative p-6 flex-auto">
                                            <p className="my-4 text-slate-500 text-lg leading-relaxed">
                                                Soll Ihr Einkauf bestätigt werden?
                                            </p>
                                        </div>
                                        {/*footer*/}
                                        <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                            <button
                                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Abbrechen
                                            </button>
                                            <button
                                                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={buyItems}
                                            >
                                                Bestätigen
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                        </>
                    ) : null}
                </div>
            </div>
        );
    } else {
        window.location.href = '/login';
    }
};
