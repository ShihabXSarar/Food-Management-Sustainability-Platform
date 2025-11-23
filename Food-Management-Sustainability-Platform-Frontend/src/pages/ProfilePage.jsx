
import React, { useEffect, useState } from "react";
/* eslint-disable-next-line no-unused-vars */
import { motion } from "framer-motion";
import { User, Camera, Save, DollarSign, Users } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [householdSize, setHouseholdSize] = useState("");
  const [dietaryPreference, setDietaryPreference] = useState("");

  const token = localStorage.getItem("token"); // Bearer token

  // ============================
  // GET USER PROFILE
  // ============================
  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:3000/users/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setName(data.name);
      setEmail(data.email);
      setLocation(data.location);
      setHouseholdSize(data.householdSize);
      setDietaryPreference(data.dietaryPreference);

      setLoading(false);
    } catch (error) {
      console.error("Profile fetch error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ============================
  // PATCH / UPDATE USER PROFILE
  // ============================
  const handleSave = async () => {
    setSaving(true);

    try {
      const res = await fetch("http://localhost:3000/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          location,
          dietaryPreference,
          householdSize: Number(householdSize),
        }),
      });

      const updated = await res.json();

      alert("Profile updated successfully!");
      setSaving(false);
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update profile!");
      setSaving(false);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-xl font-semibold">Loading...</p>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Profile Settings
        </h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture */}
        <Card className="lg:col-span-1">
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
              {name?.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{name}</h3>
            <p className="text-gray-600 text-sm mb-4">{email}</p>
            {/* <Button variant="outline" className="w-full">
              <Camera className="w-4 h-4 mr-2 inline" />
              Change Photo
            </Button> */}
          </div>
        </Card>

        {/* Profile Form */}
        <Card className="lg:col-span-2">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Personal Information
          </h3>

          <div className="space-y-4">
            <InputField
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={User}
            />

            <InputField label="Email" type="email" value={email} disabled />

            <InputField
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Household Size"
                type="number"
                value={householdSize}
                onChange={(e) => setHouseholdSize(e.target.value)}
                icon={Users}
              />

              <InputField
                label="Dietary Preference"
                value={dietaryPreference}
                onChange={(e) => setDietaryPreference(e.target.value)}
              />
            </div>

            <Button onClick={handleSave} className="w-full" disabled={saving}>
              <Save className="w-5 h-5 mr-2 inline" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
