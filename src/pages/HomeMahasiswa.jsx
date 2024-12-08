import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getShops } from '../Services/api';

function HomeMahasiswa() {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentDateTime = new Date();
    const formattedDateTime = currentDateTime.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await getShops();
                setMenus(response.data.data || []);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                setError("Failed to load shops data");
                console.error("Error fetching shops:", err);
            }
        };

        fetchShops();
    }, []);

    return (
        <div>
            <div className="head">
                <div className="flex justify-between items-center mx-10 my-5">
                    <div className="flex justify-center items-center">
                        <h1 className="text-3xl font-bold w-[30vw]">KANTIN FILKOM</h1>
                        <div className="flex items-center bg-gray-100 rounded-sm px-4 py-2 w-full max-w-sm">
                            <input
                                type="text"
                                placeholder="Search product"
                                className="flex-grow bg-transparent outline-none text-gray-600 placeholder-gray-400"
                            />
                            <button>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-gray-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-4.35-4.35M16.65 11a5.65 5.65 0 11-11.3 0 5.65 5.65 0 0111.3 0z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <span>{formattedDateTime}</span>
                    </div>
                </div>
            </div>

            <div className="flex h-full">
                <div className="flex-1 justify-between p-8 border-2 border-gray-100">
                    <h2 className="text-2xl font-semibold mb-4">KANTIN LIST</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : menus.length === 0 ? (
                            <p className="text-gray-500">Belum ada kantin yang tersedia</p>
                        ) : (
                            menus.map((menu) => (
                                <div
                                    className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md"
                                    key={menu.shop_id}
                                >
                                    <img
                                        src="/assets/img/kantin.png"
                                        alt={menu.shop_name}
                                        className="w-full h-40 object-cover rounded-lg mb-4"
                                    />
                                    <div className="text-xl font-semibold mb-2">{menu.shop_name}</div>
                                    <p className="text-gray-500 mb-2">{menu.shop_description}</p>
                                    <div className="flex justify-between items-center gap-5 w-full">
                                        {/* Link to dynamic menu page using shop_id */}
                                        <Link
                                            to="/menuKantin"
                                            className="mt-4 bg-blue-500 text-white py-1 px-6 rounded-lg hover:bg-blue-600 text-center w-full"
                                        >
                                            View Menu
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="w-1/4 p-8 border-2 border-gray-100">
                    <h2 className="text-2xl font-semibold mb-4">ORDER #</h2>
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-gray-500">Guest:</span>
                        <span className="font-semibold">---</span>
                    </div>
                    <div className="flex justify-center items-center mb-6">
                        <div className="text-center">
                            <img src="/assets/img/Null.png" alt="empty basket" className="h-24 m-10" />
                            <p className="text-sm text-gray-500">No products in this moment added</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-between p-4 bg-gray-100">
        <button
          className="bg-red-500 mx-5 text-white py-2 px-6 rounded-lg hover:bg-red-600 w-30"
          onClick=""
        >
          Logout
        </button>
      </div>
        </div>
    );
}

export default HomeMahasiswa;
