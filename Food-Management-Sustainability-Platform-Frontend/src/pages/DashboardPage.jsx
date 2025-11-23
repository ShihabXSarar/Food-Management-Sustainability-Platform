import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import { BASE_URL } from "../api";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);

  const [foodItems, setFoodItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    expirationDays: 1,
    costPerUnit: 1,
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      // Dashboard API
      const resDashboard = await fetch(`${BASE_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dashData = await resDashboard.json();

      // Food Items API
      const resItems = await fetch(`${BASE_URL}/food-items`);
      const itemsData = await resItems.json();

      setDashboard(dashData);
      setFoodItems(itemsData);
    } catch (err) {
      console.log(err);
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createFoodItem = async () => {
    if (!newItem.name || !newItem.category)
      return alert("Name and category required");
    if (newItem.expirationDays < 1) return alert("Expiration days must be ≥ 1");
    if (newItem.costPerUnit < 1) return alert("Cost per unit must be ≥ 1");

    try {
      const res = await fetch(`${BASE_URL}/food-items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      setNewItem({ name: "", category: "", expirationDays: 1, costPerUnit: 1 });
      fetchData();
      alert("Food item added!");
    } catch (err) {
      console.log(err);
    }
  };

  const deleteFoodItem = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/food-items/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) return alert("Delete failed");

      fetchData();
      alert("Food item deleted!");
    } catch (err) {
      console.log(err);
    }
  };

  if (loading || !dashboard)
    return (
      <div className="text-center py-20 text-xl font-semibold text-gray-700">
        Loading Dashboard...
      </div>
    );

  const { profile, inventorySummary } = dashboard;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"
    >
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-600">Welcome {profile?.name}!</p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-8">
        <Card>
          <p className="text-sm text-gray-500">Total Items</p>
          <p className="text-3xl font-bold">{inventorySummary.totalItems}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Expiring Soon</p>
          <p className="text-3xl font-bold">{inventorySummary.expiringSoon}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Items Used</p>
          <p className="text-3xl font-bold">0</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Money Saved</p>
          <p className="text-3xl font-bold">$0</p>
        </Card>
      </div>

      {/* Food Items */}
      <Card className="mb-10">
        <h2 className="text-xl font-bold mb-4">Food Items</h2>

        {/* Add Form */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
          <div className="flex flex-col">
            <p className="text-gray-600 text-sm mb-1">Name</p>
            <input
              className="border p-2 rounded"
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="Enter name"
            />
          </div>

          <div className="flex flex-col">
            <p className="text-gray-600 text-sm mb-1">Category</p>
            <input
              className="border p-2 rounded"
              type="text"
              value={newItem.category}
              onChange={(e) =>
                setNewItem({ ...newItem, category: e.target.value })
              }
              placeholder="Enter category"
            />
          </div>

          <div className="flex flex-col">
            <p className="text-gray-600 text-sm mb-1">Expiring day</p>
            <input
              className="border p-2 rounded"
              type="number"
              min={1}
              value={newItem.expirationDays}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  expirationDays: Number(e.target.value),
                })
              }
              placeholder="Expiring day"
            />
          </div>

          <div className="flex flex-col">
            <p className="text-gray-600 text-sm mb-1">Price ($)</p>
            <input
              className="border p-2 rounded"
              type="number"
              min={1}
              value={newItem.costPerUnit}
              onChange={(e) =>
                setNewItem({ ...newItem, costPerUnit: Number(e.target.value) })
              }
              placeholder="Enter price"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={createFoodItem}
              className="bg-blue-600 text-white px-4 py-2 rounded font-semibold w-full"
            >
              Add
            </button>
          </div>
        </div>

        {/* Items List */}
        {foodItems.length === 0 && (
          <p className="text-gray-500">No items found.</p>
        )}

        {foodItems.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center bg-gray-50 p-3 rounded mb-2"
          >
            <span>
              {item.name} ({item.category}) — {item.expirationDays} days | $
              {item.costPerUnit}
            </span>
            <Trash2
              onClick={() => deleteFoodItem(item._id)}
              className="w-5 h-5 text-red-600 cursor-pointer"
            />
          </div>
        ))}
      </Card>
    </motion.div>
  );
};

export default DashboardPage;
