import express from "express";
import {
  createRestaurant,
  getRestaurant,
  getRestaurantOrder,
  getSingleRestaurant,
  searchRestaurant,
  updateOrderStatus,
  updateRestaurant,
} from "../controller/restaurant.controller";
import upload from "../middlewares/multer";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import asyncHandler from "../utils/asyncHandler";

const router = express.Router();

router.post(
  "/",
  asyncHandler(isAuthenticated),
  upload.single("imageFile"),
  asyncHandler(createRestaurant)
);

router.get("/", asyncHandler(isAuthenticated), asyncHandler(getRestaurant));

router.put(
  "/",
  asyncHandler(isAuthenticated),
  upload.single("imageFile"),
  asyncHandler(updateRestaurant)
);

router.get(
  "/order",
  asyncHandler(isAuthenticated),
  asyncHandler(getRestaurantOrder)
);

router.put(
  "/order/:orderId/status",
  asyncHandler(isAuthenticated),
  asyncHandler(updateOrderStatus)
);

router.get(
  "/search/:searchText",
  asyncHandler(isAuthenticated),
  asyncHandler(searchRestaurant)
);

router.get(
  "/:id",
  asyncHandler(isAuthenticated),
  asyncHandler(getSingleRestaurant)
);

export default router;
