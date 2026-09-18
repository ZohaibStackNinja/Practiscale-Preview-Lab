import { Router } from "express";
import { createSampleProject } from "../controllers/sampleController.js";

export const sampleRouter = Router();

sampleRouter.post("/", createSampleProject);
