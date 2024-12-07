import jsonServer from "json-server";
import auth from "json-server-auth";
import cors from "cors";
import jwt from "jsonwebtoken";
import express from "express"; // You need to import express

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
