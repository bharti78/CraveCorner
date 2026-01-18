"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const order_controller_1 = require("../controller/order.controller");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const router = express_1.default.Router();
router.get("/", (0, asyncHandler_1.default)(isAuthenticated_1.isAuthenticated), (0, asyncHandler_1.default)(order_controller_1.getOrders));
router.post("/checkout/create-checkout-session", (0, asyncHandler_1.default)(isAuthenticated_1.isAuthenticated), (0, asyncHandler_1.default)(order_controller_1.createCheckoutSession));
router.post("/webhook", express_1.default.raw({ type: "application/json" }), (0, asyncHandler_1.default)(order_controller_1.stripeWebhook));
exports.default = router;
