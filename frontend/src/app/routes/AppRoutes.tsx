import type { ReactNode } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "@/Pages/Home";
import Allproduct from "@/Pages/Allproduct";
import About from "@/Pages/About";
import ProductCategory from "@/Pages/ProductCategory";
import ProductDetails from "@/Pages/ProductDetails";
import Login from "@/Pages/Login";
import Cart from "@/Pages/Cart";
import AddAddress from "@/Pages/AddAddress";
import Myorder from "@/Pages/Myorder";
import Payment from "@/Pages/Payment";
import Confirmation from "@/Pages/OrderConfirmatiom";
import Profile from "@/Pages/Profile";
import SellerLogin from "@/components/Seller/SellerLogin";
import SellerLayout from "@/Pages/Seller/SellerLayout";
import AddProduct from "@/Pages/Seller/AddProduct";
import ProductList from "@/Pages/Seller/ProductList";
import Orders from "@/Pages/Seller/Orders";
import UserTransactionsPage from "@/features/transactions/pages/UserTransactionsPage";
import SellerTransactionsPage from "@/features/transactions/pages/SellerTransactionsPage";
import NotFound from "@/Pages/Notfound";

type AppRoutesProps = {
  user: unknown;
  isSeller: boolean;
};

const UserProtectedRoute = ({
  children,
  canAccess,
}: {
  children: ReactNode;
  canAccess: boolean;
}) => {
  const location = useLocation();
  if (!canAccess) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

const SellerProtectedRoute = ({
  children,
  canAccess,
}: {
  children: ReactNode;
  canAccess: boolean;
}) => {
  if (!canAccess) {
    return <Navigate to="/seller/login" replace />;
  }
  return children;
};

export default function AppRoutes({ user, isSeller }: AppRoutesProps) {
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Allproduct />} />
      <Route path="/about" element={<About />} />
      <Route path="/products/:category" element={<ProductCategory />} />
      <Route path="/products/:category/:id" element={<ProductDetails />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/cart"
        element={
          <UserProtectedRoute canAccess={Boolean(user)}>
            <Cart />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/add-address"
        element={
          <UserProtectedRoute canAccess={Boolean(user)}>
            <AddAddress />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/my-orders"
        element={
          <UserProtectedRoute canAccess={Boolean(user)}>
            <Myorder />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <UserProtectedRoute canAccess={Boolean(user)}>
            <UserTransactionsPage />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <UserProtectedRoute canAccess={Boolean(user)}>
            <Profile />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <UserProtectedRoute canAccess={Boolean(user)}>
            <Profile />
          </UserProtectedRoute>
        }
      />

      <Route path="/payment" element={<Payment />} />
      <Route path="/confirmation" element={<Confirmation />} />
      <Route path="/seller/login" element={<SellerLogin />} />

      <Route
        path="/seller"
        element={
          <SellerProtectedRoute canAccess={isSeller}>
            <SellerLayout />
          </SellerProtectedRoute>
        }
      >
        <Route index element={<AddProduct />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="product-list" element={<ProductList />} />
        <Route path="orders" element={<Orders />} />
        <Route path="transactions" element={<SellerTransactionsPage />} />
      </Route>
    </Routes>
  );
}
