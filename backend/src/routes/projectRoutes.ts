import { Router } from "express";
import {
  createProject,
  getProject,
  updateProject,
  deleteProject,
  listProjects,
  uploadChannelAsset,
} from "../controllers/projectController.js";
import {
  uploadVariant,
  listVariants,
} from "../controllers/variantController.js";
import {
  createShare,
  getProjectShares,
} from "../controllers/shareController.js";
import { listProjectComments } from "../controllers/commentController.js";
import { uploadMiddleware } from "../middleware/upload.js";

export const projectRouter = Router();

projectRouter.post("/", createProject);
projectRouter.get("/", listProjects);
projectRouter.get("/:id", getProject);
projectRouter.patch("/:id", updateProject);
projectRouter.delete("/:id", deleteProject);
projectRouter.post(
  "/:id/channel-assets",
  uploadMiddleware.single("image"),
  uploadChannelAsset,
);

// Nested variant uploads on project
projectRouter.post(
  "/:projectId/variants",
  uploadMiddleware.single("image"),
  uploadVariant,
);
projectRouter.get("/:projectId/variants", listVariants);

// Nested shares on project
projectRouter.post("/:projectId/shares", createShare);
projectRouter.get("/:projectId/shares", getProjectShares);

// Nested comments on project
projectRouter.get("/:projectId/comments", listProjectComments);
