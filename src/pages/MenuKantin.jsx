import React, { useEffect, useState } from "react";
import { getMenus } from "../Services/api";

function MenuKantin() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState([]);
  const [showQRCode, setShowQRCode] = useState(false);

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
    const fetchMenu = async () => {
      try {
        const response = await getMenus();
        if (response?.data?.data) {
          setMenu(response.data.data);
        } else {
          setError("Invalid data structure from server");
        }
      } catch (err) {
        setError("Failed to load menu data");
        console.error("Error fetching menu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleAddToOrder = (item) => {
    setOrder((prevOrder) => {
      const existingItem = prevOrder.find((orderItem) => orderItem.id === item.id);
      if (existingItem) {
        return prevOrder.map((orderItem) =>
          orderItem.id === item.id ? { ...orderItem, quantity: orderItem.quantity + 1 } : orderItem
        );
      }
      return [...prevOrder, { ...item, quantity: 1 }];
    });
  };

  const handleRemoveFromOrder = (item) => {
    setOrder((prevOrder) => {
      const existingItem = prevOrder.find((orderItem) => orderItem.id === item.id);
      if (existingItem && existingItem.quantity > 1) {
        return prevOrder.map((orderItem) =>
          orderItem.id === item.id ? { ...orderItem, quantity: orderItem.quantity - 1 } : orderItem
        );
      }
      return prevOrder.filter((orderItem) => orderItem.id !== item.id);
    });
  };

  const closeQRCodeModal = () => {
    setShowQRCode(false);
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <div className="head bg-white shadow-md">
        <div className="flex justify-between items-center mx-10 my-5">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-gray-700">KANTIN FILKOM</h1>
            <div className="flex items-center bg-gray-100 rounded-sm px-4 py-2 ml-10 w-[40vw]">
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

      <div className="flex">
        {/* Menu Section */}
        <div className="m-20 flex-grow">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : menu.length === 0 ? (
            <p>No menu available for this shop</p>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {menu.map((item) => (
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300" key={item.id}>
                  <h3 className="text-xl font-semibold text-gray-700">{item.menu_name || "No Name"}</h3>
                  <p className="text-gray-500 mb-3">{item.description || "No description"}</p>
                  <p className="text-sm text-green-600">{item.status || "Status not available"}</p>
                  <p className="text-gray-600 mt-2">{item.price ? `Rp ${item.price.toLocaleString("id-ID")}` : "No Price"}</p>
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => handleRemoveFromOrder(item)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleAddToOrder(item)}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Section */}
        <div className="w-1/4 p-8 border-l border-gray-100 bg-gray-50">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">ORDER #</h2>
          <div className="flex items-center justify-between mb-6">
            <span className="text-gray-500">Guest:</span>
            <span className="font-semibold">---</span>
          </div>
          <div className="flex justify-center items-center mb-6 ">
            {order.length === 0 ? (
              <div className="text-center">
                <img src="/assets/img/Null.png" alt="empty basket" className="h-24 m-10" />
                <p className="text-sm text-gray-500">No products added yet</p>
              </div>
            ) : (
              <div className="flex flex-col justify-between h-full w-[90%]">
                {/* Order Items */}
                {order.map((item) => (
                  <div key={item.id} className="flex justify-between mb-2 p-5 shadow-md">
                    <span className="text-gray-700">{item.menu_name}</span>
                    <span className="text-gray-600">
                      {item.quantity} x Rp {item.price.toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
                
                {/* Total and Payment Method Section */}
                <div className="mt-4 p-5">
                  <div className="flex justify-between mb-4">
                    <span className="font-semibold">Total:</span>
                    <span className="font-semibold text-green-600">
                      Rp{" "}
                      {order.reduce(
                        (total, item) => total + item.price * item.quantity,
                        0
                      ).toLocaleString("id-ID")}
                    </span>
                  </div>
              
                  {/* Payment Method Dropdown */}
                  <div className="mb-4">
                    <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700">Metode Pembayaran</label>
                    <select
                      id="payment-method"
                      className="mt-2 w-full p-2 border border-gray-300 rounded-md text-gray-700"
                    >
                      <option value="cash">Cash</option>
                      <option value="transfer">Transfer</option>
                    </select>
                  </div>
              
                  {/* Pay Button */}
                  <button
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                    onClick={() => setShowQRCode(true)} // Show QR code in modal
                  >
                    Bayar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
            <div className="flex justify-end">
              <button
                className="text-gray-600"
                onClick={closeQRCodeModal} // Close the modal
              >
                X
              </button>
            </div>
            <img src="/assets/img/QR.png" alt="QR Code" className="w-40 h-40 mx-auto" />
            <p className="text-center mt-4">Scan this QR to pay</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuKantin;
