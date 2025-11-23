import React, { useState } from "react";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";
import { BASE_URL } from "../../api";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [dietaryPreference, setDietaryPreference] = useState("general");

  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (pwd) => {
    const regex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;

    if (!pwd) {
      setPasswordError("Password is required");
      return false;
    }
    if (pwd.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    if (!regex.test(pwd)) {
      setPasswordError(
        "Password must contain at least one letter, one number & one symbol"
      );
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (!name || !email || !password || !location) {
      alert("Please fill all fields");
      return;
    }

    if (!validatePassword(password)) return;

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          location,
          dietaryPreference,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Registration failed");

      alert("Registration successful!");
      navigate("/login"); // go to login page
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50"
    >
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <Leaf className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">Join EcoFood for sustainable living</p>
        </div>

        <form onSubmit={handleSubmit}>
          <InputField
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <InputField
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <InputField
            label="Password"
            type="password"
            placeholder="•••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}

          <InputField
            label="Location"
            placeholder="Dhaka"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <label className="block text-sm font-medium mb-1 text-gray-700">
            Dietary Preference
          </label>
          <select
            className="w-full border rounded-lg p-2 mb-4"
            value={dietaryPreference}
            onChange={(e) => setDietaryPreference(e.target.value)}
          >
            <option value="general">General</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>

          <Button type="submit" className="w-full mb-4" disabled={loading}>
            {loading ? "Registering..." : "Create Account"}
          </Button>

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </Card>
    </motion.div>
  );
};

export default RegisterPage;
