import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Leaf, BookOpen, Calendar, Package, Eye } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

// Map string icon names from backend to actual React components
const iconMap = {
  Leaf,
  BookOpen,
  Calendar,
  Package,
};

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(false);

  // Fetch resources from API
  const fetchResources = async (category = "all") => {
    setLoading(true);
    try {
      let url = "http://localhost:3000/resources"; // default all resources
      if (category !== "all") {
        url = `http://localhost:3000/resources/category?name=${category}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setResources(data);
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on page load and when category changes
  useEffect(() => {
    fetchResources(filterCategory);
  }, [filterCategory]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Sustainability Resources
        </h1>
        <p className="text-gray-600">
          Explore guides and tips for sustainable food management
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          <option value="Tips">Tips</option>
          <option value="Guide">Guides</option>
          <option value="storage">Storage</option>
          <option value="nutrition">Nutrition</option>
        </select>
      </div>

      {/* Resources Grid */}
      {loading ? (
        <p>Loading resources...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => {
            const ResourceIcon = iconMap[resource.icon] || Leaf; // fallback icon
            return (
              <Card key={resource._id || resource.id}>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
                    <ResourceIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-800">
                        {resource.title}
                      </h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full whitespace-nowrap ml-2">
                        {resource.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {resource.description}
                    </p>
                    <Button
                      variant="outline"
                      className="w-full text-sm"
                      onClick={() => window.open(resource.url, "_blank")}
                    >
                      <Eye className="w-4 h-4 mr-2 inline" />
                      View Resource
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default ResourcesPage;
