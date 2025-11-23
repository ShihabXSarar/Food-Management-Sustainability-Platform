/* eslint-disable-next-line no-unused-vars */
import { motion } from "framer-motion";
import React, { use, useState } from "react";
import { Leaf } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api";
import AuthContext from "../../context/AuthContext";


// 🔥 Base URL আলাদা করে রাখা হলো


const LoginPage = () => {
  const { setUser }=use(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // Save JWT token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setUser(data.user);
      alert("Login Successful!");

      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      alert(err.message || "Failed to login");
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
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your EcoFood account</p>
          <p className="text-gray-600 text-sm">
            Demo Credentials: <br />
            Email: <span className="font-semibold">a@gmail.com</span> <br />
            Password: <span className="font-semibold">123456</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" className="w-full mb-4" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-green-600 hover:underline font-medium"
            >
              Register
            </Link>
          </p>
        </form>
      </Card>
    </motion.div>
  );
};

export default LoginPage;
