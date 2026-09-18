import { Router } from "express";
import {
  updateVariant,
  deleteVariant,
} from "../controllers/variantController.js";

export const variantRouter = Router();

variantRouter.patch("/:id", updateVariant);
variantRouter.delete("/:id", deleteVariant);
