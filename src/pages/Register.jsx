import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignupPage = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [waNumber, setWaNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (!fullname || !email || !password || !waNumber) {
      setError("All fields are required.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!termsAccepted) {
      setError("You must accept the terms and conditions.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/auth/register", {
        fullname,
        email,
        password,
        wa_number: waNumber,
      });
      alert("Registration successful!");
      console.log(response.data);
      navigate("/"); // Redirect to login page after successful registration
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-blue-500 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white p-4 rounded-lg">
            <div className="w-48 h-48 flex items-center justify-center text-blue-500 text-5xl font-bold">
              <img
                src="/assets/img/heroLogo.png"
                alt="Icon"
                className="max-w-full max-h-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-1/2 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-6">FILKOM CANTEEN</h1>
        <h2 className="text-xl mb-4">Create account</h2>
        <form className="w-3/4 max-w-md" onSubmit={handleSignup}>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="tel"
              placeholder="Nomor HP"
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="terms"
              className="mr-2"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <label htmlFor="terms" className="text-sm">
              I agree to terms & conditions
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>
        <p className="mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Sign in Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
