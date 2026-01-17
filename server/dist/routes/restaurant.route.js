"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const restaurant_controller_1 = require("../controller/restaurant.controller");
const multer_1 = __importDefault(require("../middlewares/multer"));
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const router = express_1.default.Router();
router.post("/", (0, asyncHandler_1.default)(isAuthenticated_1.isAuthenticated), multer_1.default.single("imageFile"), (0, asyncHandler_1.default)(restaurant_controller_1.createRestaurant));
router.get("/", (0, asyncHandler_1.default)(isAuthenticated_1.isAuthenticated), (0, asyncHandler_1.default)(restaurant_controller_1.getRestaurant));
router.put("/", (0, asyncHandler_1.default)(isAuthenticated_1.isAuthenticated), multer_1.default.single("imageFile"), (0, asyncHandler_1.default)(restaurant_controller_1.updateRestaurant));
router.get("/order", (0, asyncHandler_1.default)(isAuthenticated_1.isAuthenticated), (0, asyncHandler_1.default)(restaurant_controller_1.getRestaurantOrder));
router.put("/order/:orderId/status", (0, asyncHandler_1.default)(isAuthenticated_1.isAuthenticated), (0, asyncHandler_1.default)(restaurant_controller_1.updateOrderStatus));
router.get("/search/:searchText", (0, asyncHandler_1.default)(isAuthenticated_1.isAuthenticated), (0, asyncHandler_1.default)(restaurant_controller_1.searchRestaurant));
router.get("/:id", (0, asyncHandler_1.default)(isAuthenticated_1.isAuthenticated), (0, asyncHandler_1.default)(restaurant_controller_1.getSingleRestaurant));
exports.default = router;
