import React, { useState, useEffect } from "react";
/* eslint-disable-next-line no-unused-vars */
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";
import Modal from "../components/ui/Modal";

const InventoryPage = () => {
  const [items, setItems] = useState([]);
  const [foodItems, setFoodItems] = useState([]); // ALL FOOD ITEMS
  const [filteredFood, setFilteredFood] = useState([]); // For suggestions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const [formData, setFormData] = useState({
    item: "", // food item id
    itemName: "", // for showing suggestions
    quantity: "",
    expiryDate: "",
  });

  const token = localStorage.getItem("token");

  // Fetch food items + inventory
  useEffect(() => {
    fetchInventory();
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const res = await fetch("http://localhost:3000/food-items");
      const data = await res.json();
      setFoodItems(data);
    } catch (e) {
      console.error("Food fetch error", e);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await fetch("http://localhost:3000/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ADD ITEM
  const handleAddItem = async (e) => {
    e.preventDefault();

    if (!formData.item) {
      alert("Please select a food item from suggestions!");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          item: formData.item,
          quantity: Number(formData.quantity),
          expiryDate: formData.expiryDate,
        }),
      });

      if (!res.ok) throw new Error("Failed to add inventory item");
      const newItem = await res.json();

      setItems([newItem, ...items]);

      setIsModalOpen(false);
      setFormData({
        item: "",
        itemName: "",
        quantity: "",
        expiryDate: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/inventory/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete");

      setItems(items.filter((x) => x._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Filter inventory items by search + category
  const filteredItems = items.filter((inv) => {
    const name = inv.item?.name || "";
    const category = inv.item?.category || "";
    const matchesSearch = name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  // Autocomplete for food-items
  const handleFoodSearch = (value) => {
    setFormData({ ...formData, itemName: value });

    if (!value) {
      setFilteredFood([]);
      return;
    }

    const matches = foodItems.filter((f) =>
      f.name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredFood(matches);
  };

  const selectFoodItem = (food) => {
    setFormData({
      ...formData,
      itemName: food.name,
      item: food._id, // AUTO SETTING ID
    });
    setFilteredFood([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Inventory</h1>
          <p className="text-gray-600">Manage your food items</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2 inline" />
          Add Item
        </Button>
      </div>

      {/* Search + Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Categories</option>
          <option value="fruit">Fruits</option>
          <option value="vegetable">Vegetables</option>
          <option value="dairy">Dairy</option>
          <option value="grain">Grains</option>
        </select>
      </div>

      {/* SHOW INVENTORY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((inv) => (
          <Card key={inv._id}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold">{inv.item?.name}</h3>
                <p className="text-sm text-gray-600">{inv.item?.category}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  new Date(inv.expiryDate) > new Date()
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {new Date(inv.expiryDate) > new Date()
                  ? "Fresh"
                  : "Expiring Soon"}
              </span>
            </div>

            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Quantity:</span> <span>{inv.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span>Expires:</span>{" "}
                <span>{inv.expiryDate.split("T")[0]}</span>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <Button
                variant="danger"
                onClick={() => handleDeleteItem(inv._id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* ADD ITEM MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Item"
      >
        <form className="space-y-4" onSubmit={handleAddItem}>
          {/* Autocomplete Input */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              Food Item Name
            </label>
            <input
              type="text"
              placeholder="Search food item..."
              value={formData.itemName}
              onChange={(e) => handleFoodSearch(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />

            {/* Suggestion Dropdown */}
            {filteredFood.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow max-h-40 overflow-y-auto z-50">
                {filteredFood.map((f) => (
                  <div
                    key={f._id}
                    onClick={() => selectFoodItem(f)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {f.name} —{" "}
                    <span className="text-gray-500">{f.category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <InputField
            label="Quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
            required
          />

          <InputField
            label="Expiry Date"
            type="date"
            value={formData.expiryDate}
            onChange={(e) =>
              setFormData({ ...formData, expiryDate: e.target.value })
            }
            required
          />

          <div className="flex space-x-3">
            <Button type="submit" className="flex-1">
              Add Item
            </Button>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default InventoryPage;
