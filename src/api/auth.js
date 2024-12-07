export const login = async (credentials) => {
  const response = await fetch("http://localhost:5000/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();
  return data;
};

export const signUp = async (credentials) => {
  const response = await fetch("http://localhost:5000/auth/signup", {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Signup failed");
  }

  const data = await response.json();
  return data;
};
