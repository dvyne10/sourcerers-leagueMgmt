import express from "express";
import path from "path";
import cors from "cors";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

/**
 * - POST /api/users - Register a user
 * - POST /api/users/auth - Authenticate a user and get a token
 * - POST /api/users/logout - logout user and clear cookie
 * - GET /api/users/profile - Get user profile
 * - PUT /api/users/profile - update user profile
 */

app.get("/leagues", (req, res) => {
  res.send({ message: "Welcome to the Leagues page." });
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
