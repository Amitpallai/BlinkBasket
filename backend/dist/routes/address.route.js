"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const address_controller_1 = require("../controllers/address.controller");
const authUser_1 = require("../middlewares/authUser");
const addressRoute = express_1.default.Router();
addressRoute.post('/add', authUser_1.authUser, address_controller_1.addAddress);
addressRoute.get('/get', authUser_1.authUser, address_controller_1.getAddress);
exports.default = addressRoute;
