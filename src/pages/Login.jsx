import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; 

const Login = () => {
  const { login } = useContext(AuthContext); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    let endpoint = "";

    if (username.includes("@")) {
      endpoint = "/auth/login";
    } else {
      endpoint = "/auth/admin/login";
    }

    try {
      const loginData = username.includes("@")
        ? { email: username, password }
        : { username, password };

      const response = await axios.post(endpoint, loginData);


      const token = response.data.data.token;
      console.log(token)
      if (token) {
        const decodedToken = jwtDecode(token);

        let role = "Unknown role";

        if (decodedToken.iss === "admin") {
          const roleMapping = {
            "01938d4a-94a7-6215-66a0-f65c886361c1": "admin",
          };
          role = roleMapping[decodedToken.role] || "Unknown role";
        } else if (decodedToken.iss === "user") {
          role = decodedToken.role || "Unknown role";
        }

        login({ ...decodedToken, token });

        if (role === "admin") {
          navigate("/homeAdmin");
        } else if (role === "User") {
          navigate("/homeMahasiswa");
        } else {
          navigate("/homePenjual");
        }
      }
    } catch (error) {
      setError("Login failed. Please check your credentials and try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 bg-blue-500 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white p-4 rounded-lg">
            <div className="w-48 h-48 flex items-center justify-center text-blue-500 text-5xl font-bold">
              <img src="heroLogo.png" alt="Icon" className="max-w-full max-h-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full p-6">
          <h1 className="text-4xl font-bold mb-6 text-black">Welcome</h1>
          <p className="mb-8 text-gray-500">Please login to your account</p>

          {error && <div className="mb-4 text-red-500">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username or Email
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your username or email"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white py-2 px-4 rounded-lg transition ${
                isLoading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
