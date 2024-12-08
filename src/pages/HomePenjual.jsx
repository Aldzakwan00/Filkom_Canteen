import React, { useEffect, useState } from "react";
import { getMenus, createMenu } from "../Services/api";

function MenuKantin() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(null);
  const [updatedMenu, setUpdatedMenu] = useState({ menu_name: "", price: "" });
  const [newMenu, setNewMenu] = useState({
    menu_name: "",
    price: "",
    status: "Ada",
    shop_id: "MDE5M2E1MDAtODcyMi1jM2UzLWMwMmEtMzBhOTk5YzIyOGEw",
  });

  const [order, setOrder] = useState([]);
  

  // Calculate the total price for all orders
  const calculateTotal = () => {
    return order.reduce((sum, item) => sum + item.total, 0);
  };

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
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const openEditModal = (menuItem) => {
    setCurrentMenu(menuItem);
    setUpdatedMenu({ menu_name: menuItem.menu_name, price: menuItem.price });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (menuItem) => {
    setCurrentMenu(menuItem);
    setIsDeleteModalOpen(true);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleEditSave = () => {
    console.log("Updated data:", updatedMenu);
    setIsEditModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    console.log("Deleting menu with ID:", currentMenu.menu_id);
    setIsDeleteModalOpen(false);
  };

  const handleAddSave = async () => {
    try {
      const response = await createMenu(newMenu);
      if (response?.data?.data) {
        setMenu([...menu, response.data.data]);
      }
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding menu:", error);
      setError("Failed to add menu");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Content Section */}
      <div className="flex-grow flex flex-col">
        {/* Header */}
        <div className="head">
          <div className="flex justify-between items-center mx-10 my-5">
            <h1 className="text-3xl font-bold">KANTIN FILKOM</h1>
            <input
              type="text"
              placeholder="Search product"
              className="bg-gray-100 rounded-sm px-4 py-2 outline-none"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow p-10">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : menu.length === 0 ? (
            <p>No menu available for this shop</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {menu.map((item) => (
                <div className="bg-white p-4 rounded-lg shadow-md" key={item.menu_id}>
                  <h3 className="text-xl font-semibold">{item.menu_name || "No Name"}</h3>
                  <p className="text-gray-500">
                    {item.price ? `Rp ${item.price.toLocaleString("id-ID")}` : "No Price"}
                  </p>
                  <p className="text-sm text-green-600">{item.status || "Status tidak tersedia"}</p>
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600"
                      onClick={() => openEditModal(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                      onClick={() => openDeleteModal(item)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-between gap-4 mt-6">
            <button
                className="bg-red-500 mx-10 text-white py-2 px-4 rounded-md hover:bg-red-600"
                onClick={() => alert('Logging out')}
            >
                Log Out
            </button>
            <button
                className="bg-green-500 mx-10 text-white py-2 px-4 rounded-md hover:bg-green-600"
                onClick={openAddModal}
            >
                Add Menu
            </button>
            </div>
      </div>

      <div className="w-1/4 p-8 border-l border-gray-100 bg-gray-50">
      <h2 className="text-2xl font-semibold mb-4">Pesanan atas nama:</h2>
      
      {/* Nama Pembeli */}
      <div className="p-5 shadow-xl">
        <div className="flex items-center justify-between mb-6">
        </div>

        {/* Daftar Pesanan */}
        <div className="mb-6">
          {order.length === 0 ? (
            <p className="text-center text-gray-500">Belum ada pesanan</p>
          ) : (
            order.map((item, index) => (
              <div key={index} className="flex justify-between mb-2">
                <span className="font-medium">{item.name}</span>
                <span>
                  {item.quantity} x Rp {item.price.toLocaleString("id-ID")}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Total Harga */}
        {order.length > 0 && (
          <div className="flex justify-between mt-4">
            <span className="font-semibold">Total:</span>
            <span className="text-green-600">
              Rp {calculateTotal().toLocaleString("id-ID")}
            </span>
          </div>
        )}
      </div>

      {/* Tombol Selesaikan Pesanan */}
      {order.length > 0 && (
        <div className="mt-6">
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200">
            Selesaikan Pesanan
          </button>
        </div>
      )}
    </div>

      {/* Modals */}
      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Menu</h2>
            <label>Menu Name:</label>
            <input
              type="text"
              value={updatedMenu.menu_name}
              onChange={(e) => setUpdatedMenu({ ...updatedMenu, menu_name: e.target.value })}
              className="block w-full p-2 border rounded-md mb-4"
            />
            <label>Price:</label>
            <input
              type="number"
              value={updatedMenu.price}
              onChange={(e) => setUpdatedMenu({ ...updatedMenu, price: e.target.value })}
              className="block w-full p-2 border rounded-md mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 py-1 px-3 rounded-md"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600"
                onClick={handleEditSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Delete Menu</h2>
            <p>Are you sure you want to delete "{currentMenu?.menu_name}"?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="bg-gray-300 py-1 px-3 rounded-md"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Menu Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Menu</h2>
            <label>Menu Name:</label>
            <input
              type="text"
              value={newMenu.menu_name}
              onChange={(e) => setNewMenu({ ...newMenu, menu_name: e.target.value })}
              className="block w-full p-2 border rounded-md mb-4"
            />
            <label>Price:</label>
            <input
              type="number"
              value={newMenu.price}
              onChange={(e) => setNewMenu({ ...newMenu, price: e.target.value })}
              className="block w-full p-2 border rounded-md mb-4"
            />
            <label>Status:</label>
            <select
              value={newMenu.status}
              onChange={(e) => setNewMenu({ ...newMenu, status: e.target.value })}
              className="block w-full p-2 border rounded-md mb-4"
            >
              <option value="Ada">Available</option>
              <option value="Kosong">Out of Stock</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 py-1 px-3 rounded-md"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600"
                onClick={handleAddSave}
              >
                Add
              </button>
            </div>
          </div>

        </div>
      )}
      
    </div>

    
  );
}

export default MenuKantin;
