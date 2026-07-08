import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        "/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center mt-20">

      <form onSubmit={handleLogin} className="w-96 p-6 shadow-lg rounded-lg">

        <h2 className="text-3xl font-bold mb-5">
          Login
        </h2>

        {error && (
          <div className="text-red-500 mb-4 bg-red-100 p-2 rounded text-sm">
            {error}
          </div>
        )}

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
          className="bg-blue-500 text-white w-full p-3 rounded cursor-pointer"
        >
          Login
        </button>

      </form>

    </div>
  );
}

export default Login;