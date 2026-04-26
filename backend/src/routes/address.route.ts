import express from "express";
import { addAddress, getAddress } from "../controllers/address.controller";
import { authUser } from "../middlewares/authUser";


const addressRoute = express.Router();

addressRoute.post('/add',authUser,addAddress)
addressRoute.get('/get',authUser,getAddress)

export default addressRoute
