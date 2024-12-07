import jsonServer from "json-server";
import auth from "json-server-auth";
import cors from "cors";

const server = jsonServer.create();
const router = jsonServer.router("src/db/db.json");
const middlewares = jsonServer.defaults();

server.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Specify the allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify the allowed headers
  })
);

server.db = router.db;

server.use(middlewares);
server.use(auth);
server.use(router);

const PORT = 5001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});
