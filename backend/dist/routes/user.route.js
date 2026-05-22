"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const authUser_1 = require("../middlewares/authUser");
const userRouter = express_1.default.Router();
userRouter.post('/signup', user_controller_1.signup);
userRouter.post('/login', user_controller_1.login);
userRouter.get('/isauth', authUser_1.authUser, user_controller_1.isAuth);
userRouter.get('/logout', authUser_1.authUser, user_controller_1.logout);
exports.default = userRouter;
