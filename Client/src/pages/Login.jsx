import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // loading state
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    setLoading(true); // start loading
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:9999/api/users/login",
        { email, password }
      );

      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/"); // redirect after login
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-orange-500">
          Welcome Back
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading} // disable input while logging in
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading} // disable input while logging in
        />

        <button
          onClick={submit}
          disabled={loading} // disable button while logging in
          className={`w-full py-3 rounded-xl text-white transition ${
            loading ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {loading ? "Processing..." : "Login"} {/* show processing */}
        </button>

        <p className="text-sm mt-4 text-center text-gray-500">
          No account?{" "}
          <a href="/register" className="text-orange-500 font-medium hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
