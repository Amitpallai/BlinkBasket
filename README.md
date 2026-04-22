# Grocery-Mart

Grocery-Mart is a full-stack e-commerce web application designed for seamless online grocery shopping. The platform provides a modern, intuitive interface for customers to browse products, manage their cart, and place orders, while also offering a robust dashboard for sellers to manage inventory and view orders.

---

## Features

### For Customers
- **Product Browsing:** Explore products by category and search functionality.
- **Product Details:** View detailed information for each product.
- **Cart Management:** Add, update, or remove items from the shopping cart.
- **Order Placement:** Place orders with support for Cash on Delivery and Stripe payments.
- **Order Tracking:** View order history and status.
- **User Authentication:** Secure signup, login, and logout.

### For Sellers/Admins
- **Authentication:** Secure seller login/logout.
- **Product Management:** Add, edit, or remove products with image uploads.
- **Inventory Control:** Manage stock and product availability.
- **Order Management:** View and process customer orders.

---

## Technology Stack

- **Frontend:** React, React Router, Tailwind CSS, Axios, Vite
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT, Cookies
- **File Uploads:** Multer, Cloudinary
- **Payments:** Stripe
- **Notifications:** react-hot-toast

---

## Project Structure

Grocery-Mart/
│
├── backend/
│   ├── configs/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── Components/
│   │   ├── Pages/
│   │   ├── /
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── README.md
└── .gitignore

---

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Cloudinary account (for image uploads)
- Stripe account (for payments)

### Backend Setup

1. Navigate to the `backend` directory:
    ```sh
    cd backend
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Create a `.env` file with the following variables:
    ```
    MONGODB_URL=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    SELLER_EMAIL=your_admin_email
    SELLER_PASSWORD=your_admin_password
    SELLER_JWT=your_seller_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    STRIPE_SECRET_KEY=your_stripe_secret_key
    NODE_ENV=development
    ```
4. Start the backend server:
    ```sh
    npm start
    ```

### Frontend Setup

1. Navigate to the `frontend` directory:
    ```sh
    cd frontend
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Start the frontend development server:
    ```sh
    npm run dev
    ```
4. The application will be available at [http://localhost:5173](http://localhost:5173) by default.

---

## Deployment

- The application is ready for deployment on platforms such as Vercel.
- Ensure all environment variables are properly configured in your deployment settings.

---

## API Endpoints

- **User:** `/api/user/*`
- **Seller:** `/api/seller/*`
- **Product:** `/api/product/*`
- **Cart:** `/api/cart/*`
- **Address:** `/api/address/*`
- **Order:** `/api/order/*`

---

**Developed by Amit pallai**
