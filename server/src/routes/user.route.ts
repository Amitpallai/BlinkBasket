import express from "express";
import { signup, login, logout, isAuth, getProfile, updateProfile } from "../controllers/user.controller"
import { authUser } from "../middlewares/authUser";

const userRouter = express.Router()

userRouter.post('/signup', signup)
userRouter.post('/login', login)
userRouter.get('/isauth', authUser, isAuth)
userRouter.get('/logout', authUser, logout)
userRouter.get('/profile', authUser, getProfile)
userRouter.put('/profile', authUser, updateProfile)

export default userRouter
