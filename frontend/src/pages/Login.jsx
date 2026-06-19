import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ import AuthContext

export default function Login() {
  const navigate = useNavigate();
  const handleSignUp = () => {
    navigate("/signup")
   }
  const { login } = useAuth(); // ✅ get login function from context
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // ✅ fixed markdown links
  };

  // const { id } = useParams();

  const [searchParams] = useSearchParams();

  const redirect = searchParams.get("redirect");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,       // ✅ fixed markdown link
          password: formData.password,
        }),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (!res.ok) {
        setError(data.msg || "Login failed.");
        return;
      }

      // ✅ use login() from AuthContext instead of raw localStorage
      // this saves token + decodes role automatically
      login(data.token);

      // ✅ redirect based on role
      const payload = JSON.parse(atob(data.token.split(".")[1]));
     if (redirect) {
        navigate(redirect);
      } else if (payload.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      setError("Network error. Is your backend running on port 2000?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 ">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 ">

        <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome to Login Page</h2>
        <p className="text-gray-500 text-sm mb-6">Login to your account</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email} // ✅ fixed markdown link
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-lg transition text-sm mt-2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <button 
             className="w-1/1 p-2 hover:bg-gray-200 rounded-2xl"
          >
              Forgotten password?
          </button>

          <button 
              onClick={handleSignUp}
              className="w-1/1 p-2 text-blue-500  border-2 border-indigo-600 rounded-2xl hover:bg-gray-200 mt-5"
          >
              Create new account
          </button>

        </form>
      </div>
    </div>
  );
}