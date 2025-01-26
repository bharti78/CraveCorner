import express from "express";
import upload from "../middlewares/multer";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { addMenu, editMenu } from "../controller/menu.controller";
import asyncHandler from "../utils/asyncHandler";

const router = express.Router();

router.post(
    "/",
    asyncHandler(isAuthenticated),
    upload.single("image"),
    asyncHandler(addMenu)
);

router.put(
    "/:id",
    asyncHandler(isAuthenticated),
    upload.single("image"),
    asyncHandler(editMenu)
);

export default router;
