import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
        }
      );

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center mt-20">

      <form onSubmit={handleRegister} className="w-96 p-6 shadow-lg rounded-lg">

        <h2 className="text-3xl font-bold mb-5">
          Register
        </h2>

        {error && (
          <div className="text-red-500 mb-4 bg-red-100 p-2 rounded text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-500 mb-4 bg-green-100 p-2 rounded text-sm">
            {success}
          </div>
        )}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border p-3 mb-4 rounded"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border p-3 mb-4 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border p-3 mb-4 rounded"
        />

        <button
          type="submit"
          className="bg-green-500 text-white w-full p-3 rounded cursor-pointer"
        >
          Register
        </button>

      </form>

    </div>
  );
}

export default Register;