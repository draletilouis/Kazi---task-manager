import { Router } from "express";
import * as CommentController from "./comment.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = Router();

export default router;
