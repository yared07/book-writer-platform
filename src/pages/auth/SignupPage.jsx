import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { toast } from "react-hot-toast";

const Signup = () => {
  const { registerUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await registerUser({ email, password });

      toast.success("Registration successful");

      navigate("/login");
    } catch (err) {
      console.error("Error:", err);

      const errorMessage =
        err.message || "Something went wrong, please try again";

      toast.error(errorMessage);

      setError(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Sign Up</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 border border-gray-300 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-4 border border-gray-300 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-md"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
