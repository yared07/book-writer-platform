import { useState, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchUserProfile(token);
    }
  }, [token]);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userProfile = await response.json();
      setUser(userProfile);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const loginUser = async (credentials) => {
    try {
      // Replace this with your actual login API request
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (response.ok) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setUser(data.user);
        navigate("/dashboard/books");
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (err) {
      throw new Error("Login failed");
    }
  };

  const registerUser = async (credentials) => {
    try {
      // Replace this with your actual signup API request
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (response.ok) {
        await loginUser(credentials); // Automatically log in after signup
      } else {
        throw new Error(data.message || "Signup failed");
      }
    } catch (err) {
      throw new Error("Signup failed");
    }
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
