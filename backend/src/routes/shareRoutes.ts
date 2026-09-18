import { Router } from "express";
import {
  getShareByToken,
  revokeShare,
} from "../controllers/shareController.js";
import {
  listComments,
  createComment,
} from "../controllers/commentController.js";

export const shareRouter = Router();

shareRouter.get("/:token", getShareByToken);
shareRouter.post("/:id/revoke", revokeShare);
shareRouter.get("/:token/comments", listComments);
shareRouter.post("/:token/comments", createComment);
