import { useState, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

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
      const response = await fetch("http://localhost:5001/auth/signin/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (response.ok) {
        setToken(data.accessToken);
        localStorage.setItem("token", data.accessToken);
        setUser({ email: credentials.email });
        navigate("/dashboard/books");
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      throw new Error("Login failed");
    }
  };

  const registerUser = async (credentials) => {
    try {
      const response = await fetch("http://localhost:5001/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        await loginUser(credentials);
      } else {
        const data = await response.json();
        throw new Error(data || "Signup failed");
      }
    } catch (err) {
      throw new Error("Signup failed: " + err.message);
    }
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginUser,
        registerUser,
        logoutUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
