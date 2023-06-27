import express from "express";
import { authUser, login } from "../controllers/userController.js";

/**
 * - POST /api/users - Register a user
 * - POST /api/users/auth - Authenticate a user and get a token
 * - POST /api/users/logout - logout user and clear cookie
 * - GET /api/users/profile - Get user profile
 * - PUT /api/users/profile - update user profile
 */

const router = express.Router();

router.post("/auth", authUser);

router.post("/login", login);

export default router;
