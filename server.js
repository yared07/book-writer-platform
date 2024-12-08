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

server.get("/books", (req, res) => {
  const userBooks = server.db
    .get("books")
    .filter({ userId: Number(req.user.id) })
    .value();

  res.json(userBooks);
});

server.post("/books", (req, res) => {
  const book = {
    ...req.body,
    userId: req.user.id,
  };

  const newBook = server.db.get("books").insert(book).write();
  res.status(201).json(newBook);
});

server.put("/books/:id", (req, res) => {
  // Get the book ID from the route parameter
  const { id } = req.params;

  // Find the book by ID
  let book = server.db
    .get("books")
    .find({ id: parseInt(id) })
    .value();

  // If the book is not found, return a 404 error
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Ensure that the authenticated user is the one who created the book
  if (book.userId !== req.user.id) {
    return res
      .status(403)
      .json({ message: "You are not authorized to edit this book" });
  }

  // Merge the existing book with the new data from the request body
  book = {
    ...book,
    ...req.body, // This will update all fields from the request body
  };

  // Save the updated book back to the database
  server.db
    .get("books")
    .find({ id: parseInt(id) })
    .assign(book)
    .write();

  // Respond with the updated book
  res.status(200).json(book);
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

  // If user is found, check the password and generate a JWT token
  if (user) {
    const passwordMatch = password === user.password; // Assuming no hashed password yet
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // If passwords match, generate a JWT token for the user
    const token = jwt.sign({ sub: user.id, email: user.email }, "flskfj==", {
      expiresIn: "1h",
    });

    // Respond with the token and additional information
    return res.status(200).json({
      accessToken: token,
      account: "main", // User logged in as the main account
      user: {
        id: user.id,
        email: user.email,
        role: user.role, // Include role or any other relevant details
      },
    });
  }

  // If the user is not found, check if the email exists in any user's collaborators list
  const users = server.db.get("users").value();
  let collaboratorUser = null;

  for (let i = 0; i < users.length; i++) {
    const collaborators = users[i].collaborators || [];
    const collaborator = collaborators?.find(
      (collaborator) => collaborator.email === email
    );

    if (collaborator) {
      // Check if the password matches the collaborator's password
      const passwordMatch = password === collaborator.password;
      if (passwordMatch) {
        // If password matches, generate a JWT token for the main user (the owner of the account)
        const token = jwt.sign(
          { sub: users[i].id, email: users[i].email },
          "flskfj==",
          { expiresIn: "1h" }
        );

        // Respond with the token and collaborator-related info
        return res.status(200).json({
          accessToken: token,
          account: "collaborate", // Indicate that this is a collaborator's account
          user: {
            id: users[i].id,
            email: users[i].email,
            role: users[i].role, // Include the role of the main user
            collaboratorEmail: collaborator.email, // The collaborator's email
            collaboratorRole: collaborator.role, // The collaborator's role
          },
        });
      }
    }
  }

  // If no user or collaborator found, respond with an error
  return res.status(401).json({ message: "Invalid email or password." });
});

server.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { newCollaborator } = req.body;

  // Get the current user from the DB
  const user = server.db
    .get("users")
    .find({ id: Number(id) })
    .value();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Exclude the password field from being updated
  const { password, ...userWithoutPassword } = user;

  // Ensure collaborators is an array (initialize if necessary)
  const currentCollaborators = user.collaborators || [];

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

server.put("/collabs/:id", (req, res) => {
  const { id } = req.params;
  const { collaborators } = req.body; // The new collaborators list comes in the request body

  // Get the current user from the DB
  const user = server.db
    .get("users")
    .find({ id: Number(id) })
    .value();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Validate that collaborators is an array
  if (!Array.isArray(collaborators)) {
    return res.status(400).json({ message: "Collaborators must be an array." });
  }

  // Replace the user's collaborators with the new list
  const updatedUser = {
    ...user,
    collaborators, // Replace with the new collaborators array
  };

  // Update the user in the database
  server.db
    .get("users")
    .find({ id: Number(id) })
    .assign(updatedUser)
    .write();

  // Return the updated user data (including the new collaborators list)
  res.status(200).json(updatedUser);
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
