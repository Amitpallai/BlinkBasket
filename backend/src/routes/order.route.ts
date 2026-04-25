import express from "express";
import { authUser } from "../middlewares/authUser";
import { getAllOrders, getUserOrder, placeOrderCOD } from "../controllers/order.controller";
import { sellerAuth } from "../middlewares/sellerAuth";

const orderRoute = express.Router()

orderRoute.post('/cod',authUser,placeOrderCOD)
orderRoute.get('/user',authUser,getUserOrder)
orderRoute.get('/seller',sellerAuth,getAllOrders)


export default orderRoute