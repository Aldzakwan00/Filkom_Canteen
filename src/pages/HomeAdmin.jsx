import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getShops, createShop, updateShop, deleteShop, addOwner } from "../Services/api";
import { Link } from "react-router-dom";

function HomeAdmin() {
  const {logout} = useAuth();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddOwnerModalOpen, setIsAddOwnerModalOpen] = useState(false);
  const [newShop, setNewShop] = useState({
    shop_name: "",
    shop_description: "",
  });
  const [shopToEdit, setShopToEdit] = useState({
    shop_id: "",
    shop_name: "",
    shop_description: "",
  });
  const [newOwner, setNewOwner] = useState({
    fullname: "",
    wa_number: "",
    username: "",
    password: ""
  })

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewShop((prevShop) => ({
      ...prevShop,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setShopToEdit((prevShop) => ({
      ...prevShop,
      [name]: value,
    }));
  };

  const handleOwnerInputChange = (e) => {
    const { name, value } = e.target;
    setNewOwner((prevOwner) => ({
      ...prevOwner,
      [name]: value,
    }));
  };
  
  

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

  const handleAddOwner = async () => {
    try {
      await addOwner(newOwner);
      setNewOwner({
        fullname: "",
        wa_number: "",
        username: "",
        password: ""
      });
      setIsModalOpen(false); 
      alert("Owner added successfully");
    } catch (error) {
      console.error("Failed to add owner:", error);
      alert("Failed to add owner. Please try again.");
    }
  };

  const handleAddShop = async () => {
      await createShop(newShop);

      const response = await getShops();
      setMenus(response.data.data || []);
      setNewShop({ shop_name: "", shop_description: "" });
      setIsModalOpen(false);
  };

  const handleEditShop = async () => {
      await updateShop(shopToEdit.shop_id, {
        shop_name: shopToEdit.shop_name,
        shop_description: shopToEdit.shop_description,
      });

      const updatedShops = await getShops();
      setMenus(updatedShops.data.data || []);

      setShopToEdit({ shop_id: "", shop_name: "", shop_description: "" });
      setIsEditModalOpen(false);
    
  };

  const handleDeleteShop = async (shopId) => {
    const confirmDelete = window.confirm("Apa kamu yakin ingin hapus Toko?");
    if (confirmDelete) {
      try {
        await deleteShop(shopId);
        const updatedShops = await getShops();
        setMenus(updatedShops.data.data || []);
        alert("Shop deleted successfully");
      } catch (error) {
        console.error("Failed to delete shop:", error);
        alert("Failed to delete shop. Please try again.");
      }
    }
  };
  
  
  

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col min-h-screen">
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

      <div className="flex-grow p-8">
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
                  <Link
                    to={`/menu/${menu.shop_id}`}
                    className="mt-4 bg-blue-500 text-white py-1 px-6 rounded-lg hover:bg-blue-600 text-center w-full"
                  >
                    View Menu
                  </Link>
                  <button
                    onClick={() => {
                      setShopToEdit(menu);
                      setIsEditModalOpen(true);
                    }}
                    className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 flex items-center justify-center w-12"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-pencil-square"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12.146 0l3.708 3.708a1 1 0 0 1 0 1.414L5.207 12.646a1 1 0 0 1-.58.281l-3.17.847a1 1 0 0 1-1.157-1.157l.847-3.17a1 1 0 0 1 .281-.58l7.524-7.524a1 1 0 0 1 1.414 0zM11.207 2L2 11.207V13h1.793L14 4.793l-1.793-1.793L11.207 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteShop(menu.shop_id)} 
                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 flex items-center justify-center w-12"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-trash"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.5 0a.5.5 0 0 1 .5.5V1h5V.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5h2zM4 1h8V.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5V1h1a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h1V.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5V1z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setIsAddOwnerModalOpen(true)}
                    className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 flex items-center justify-center w-12"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-plus"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 0a.5.5 0 0 1 .5.5V7h6a.5.5 0 0 1 .5.5h-6v6a.5.5 0 0 1-1 0V8H1a.5.5 0 0 1-.5-.5h6V.5A.5.5 0 0 1 8 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              
            ))
          )}
        </div>
      </div>

      <div className="flex justify-between p-4 bg-gray-100">
        <button
          className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 w-30"
          onClick={handleLogout}
        >
          Logout
        </button>
        <button
          className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
          onClick={() => setIsModalOpen(true)}
        >
          Add Shop
        </button>
      </div>

      {/* Add Shop Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Add New Shop</h3>
            <input
              type="text"
              name="shop_name"
              placeholder="Shop Name"
              className="w-full mb-4 p-2 border border-gray-300 rounded"
              value={newShop.shop_name}
              onChange={handleInputChange}
            />
            <textarea
              name="shop_description"
              placeholder="Shop Description"
              className="w-full mb-4 p-2 border border-gray-300 rounded"
              value={newShop.shop_description}
              onChange={handleInputChange}
            />
            <div className="flex justify-between">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded-lg"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                onClick={handleAddShop}
              >
                Add Shop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Shop Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Shop</h3>
            <input
              type="text"
              name="shop_name"
              placeholder="Shop Name"
              className="w-full mb-4 p-2 border border-gray-300 rounded"
              value={shopToEdit.shop_name}
              onChange={handleEditInputChange}
            />
            <textarea
              name="shop_description"
              placeholder="Shop Description"
              className="w-full mb-4 p-2 border border-gray-300 rounded"
              value={shopToEdit.shop_description}
              onChange={handleEditInputChange}
            />
            <div className="flex justify-between">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded-lg"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                onClick={handleEditShop}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add Owner Modal */}
        {isAddOwnerModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Add New Owner</h3>
            <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                className="w-full mb-4 p-2 border border-gray-300 rounded"
                value={newOwner.fullname}
                onChange={handleOwnerInputChange}
            />
            <input
                type="text"
                name="wa_number"
                placeholder="WhatsApp Number"
                className="w-full mb-4 p-2 border border-gray-300 rounded"
                value={newOwner.wa_number}
                onChange={handleOwnerInputChange}
            />
            <input
                type="text"
                name="username"
                placeholder="Username"
                className="w-full mb-4 p-2 border border-gray-300 rounded"
                value={newOwner.username}
                onChange={handleOwnerInputChange}
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full mb-4 p-2 border border-gray-300 rounded"
                value={newOwner.password}
                onChange={handleOwnerInputChange}
            />
            <div className="flex justify-between">
                <button
                className="bg-gray-500 text-white py-2 px-4 rounded-lg"
                onClick={() => setIsAddOwnerModalOpen(false)}
                >
                Cancel
                </button>
                <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                onClick={handleAddOwner}
                >
                Add Owner
                </button>
            </div>
            </div>
        </div>
        )}

    </div>
  );
}

export default HomeAdmin;
