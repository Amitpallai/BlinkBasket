import express from "express";
import { signup, login, logout, isAuth } from "../controllers/user.controller"
import { authUser } from "../middlewares/authUser";

const userRouter = express.Router()

userRouter.post('/signup', signup)
userRouter.post('/login', login)
userRouter.get('/isauth', authUser, isAuth)
userRouter.get('/logout', authUser, logout)

export default userRouter