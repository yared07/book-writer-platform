import jsonServer from "json-server";
import auth from "json-server-auth";
import cors from "cors";
import jwt from "jsonwebtoken";
import express from "express"; // You need to import express
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing and comparison

const server = jsonServer.create();
const router = jsonServer.router("src/db/db.json");
const middlewares = jsonServer.defaults();

server.use(express.json()); // Ensure this is called before the routes

// Configure CORS
server.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Specify allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  })
);

// Assign the database instance
server.db = router.db;

server.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.path);
  console.log("Request headers:", req.headers);
  if (req.path.startsWith("/books")) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      var decoded = jwt.decode(token);
      const user = server.db
        .get("users")
        .find({ id: Number(decoded.sub) })
        .value();

      if (!user) {
        return res.status(403).json({ message: "User not found" });
      }

      req.user = user;
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }
  next();
});
server.post("/books", (req, res) => {
  console.log("Received POST request at /books");
  console.log("Request body:", req.body);
  console.log("Authenticated user:", req.user);

  const book = {
    ...req.body,
    userId: req.user.id,
  };

  const newBook = server.db.get("books").insert(book).write();
  res.status(201).json(newBook);
});

// Simple signup route
server.post("/auth/signup", async (req, res) => {
  const { email, password } = req.body;

  // Basic validation to ensure email and password are provided
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  // Check if the user already exists
  const existingUser = server.db.get("users").find({ email }).value();
  if (existingUser) {
    return res.status(400).json({ message: "Email already in use." });
  }

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the new user object
  const newUser = {
    email,
    password: password, // Save the hashed password
    id: Date.now(), // Simple user ID based on the current timestamp
  };

  // Save the user to the database
  server.db.get("users").push(newUser).write();

  // Generate a JWT token for the user
  const token = jwt.sign(
    { sub: newUser.id, email: newUser.email },
    "flskfj==",
    {
      expiresIn: "1h",
    }
  );
  console.log(newUser);

  // Respond with the token
  res.status(201).json({ accessToken: token });
});

// Simple signin route
server.post("/auth/signin", async (req, res) => {
  const { email, password } = req.body;

  // Basic validation to ensure email and password are provided
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  // Find the user in the database
  const user = server.db.get("users").find({ email }).value();

  // If user is not found, respond with an error
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  // Compare the provided password with the stored hashed password
  const passwordMatch = password === user.password;
  console.log(password, user.password, passwordMatch);

  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  // If passwords match, generate a JWT token for the user
  const token = jwt.sign({ sub: user.id, email: user.email }, "flskfj==", {
    expiresIn: "1h",
  });

  // Respond with the token
  res.status(200).json({ accessToken: token });
});

server.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { newCollaborator } = req.body;

  // Get the current user from the DB
  const user = server.db
    .get("users")
    .find({ id: Number(id) })
    .value();
  console.log("here", user);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Exclude the password field from being updated
  const { password, ...userWithoutPassword } = user;

  // Ensure collaborators is an array (initialize if necessary)
  const currentCollaborators = user.collaborators || [];
  console.log("here", currentCollaborators);

  // Update the user's collaborators (without changing the password)
  const updatedUser = {
    ...userWithoutPassword, // Spread the user data without the password
    collaborators: [...currentCollaborators, newCollaborator], // Add the new collaborators
  };

  // Update the user in the database
  server.db
    .get("users")
    .find({ id: Number(id) })
    .assign(updatedUser)
    .write();

  // Return the updated user data (excluding password)
  res.status(200).json(updatedUser);
});

server.get("/books", (req, res) => {
  console.log("Fetching books for user:", req.user);
  const userBooks = server.db
    .get("books")
    .filter({ userId: Number(req.user.id) })
    .value();

  console.log("Fetched books:", userBooks);
  res.json(userBooks);
});

// Apply middlewares and default routes
server.use(middlewares);
server.use(auth);
server.use(router);

// Start the server
const PORT = 5001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});
