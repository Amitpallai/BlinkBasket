

A full-stack e-commerce web application for seamless online Fresh shopping. The platform provides a modern, intuitive interface for customers to browse products, manage carts, and place orders, while offering a robust dashboard for sellers to manage inventory and fulfill orders.

**Live Demo:** [Coming Soon]

---

## ✨ Features

### 👥 For Customers
- **Product Browsing** - Explore products by category with search functionality
- **Product Details** - View comprehensive product information with images
- **Cart Management** - Add, update, or remove items with real-time updates
- **Order Placement** - Multiple payment options (UPI, Cash on Delivery)
- **Order Tracking** - View order history and real-time order status
- **Address Management** - Save and manage delivery addresses
- **User Authentication** - Secure signup, login, and profile management
- **Transaction History** - View detailed payment and transaction records

### 🏪 For Sellers/Admins
- **Seller Authentication** - Secure seller login with JWT
- **Product Management** - Add, edit, delete products with image uploads
- **Inventory Control** - Manage stock levels and product availability
- **Order Management** - View and process customer orders
- **Sales Dashboard** - Track sales and transactions
- **Cloudinary Integration** - Cloud-based image storage and optimization

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, React Router, Tailwind CSS, Vite, Axios |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens), Secure Cookies |
| **File Uploads** | Multer, Cloudinary API |
| **Payments** | UPI Integration |
| **UI Components** | Shadcn/ui, React Hot Toast |
| **Deployment** | Vercel (Frontend & Backend) |

---

## 📁 Project Structure

```
Fresh-Mart/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files (CORS, environment, services)
│   │   ├── configs/         # Setup files (Database, Cloudinary, Multer)
│   │   ├── controllers/     # Request handlers for routes
│   │   ├── middlewares/     # Authentication & authorization middleware
│   │   ├── models/          # MongoDB schemas (User, Product, Order, etc.)
│   │   ├── routes/          # API route definitions
│   │   ├── uploads/         # Temporary file storage
│   │   ├── app.ts           # Express app initialization
│   │   └── server.ts        # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── providers/   # App-level providers (Context, Auth)
│   │   │   └── routes/      # Route configuration
│   │   ├── assets/          # Static assets
│   │   ├── components/      # Reusable React components
│   │   ├── context/         # Global state management
│   │   ├── features/        # Feature-specific modules (transactions, etc.)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions and helpers
│   │   ├── Pages/           # Page components
│   │   ├── types/           # TypeScript type definitions
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/              # Static files
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── .env.example
│   └── .env
│
├── README.md
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16+ and npm/yarn
- **MongoDB** (local or Atlas connection string)
- **Cloudinary** account (for image uploads)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```env
   PORT=4000
   NODE_ENV=development

   # Database
   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/Freshmart

   # JWT
   JWT_SECRET=your_secure_jwt_secret_key
   SELLER_JWT=your_seller_jwt_secret_key

   # Seller Credentials
   SELLER_EMAIL=admin@example.com
   SELLER_PASSWORD=secure_password

   # Cloudinary (Image Uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:4000`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```env
   VITE_BACKEND_URL=http://localhost:4000
   VITE_CURRENCY=₹
   VITE_MERCHANT_UPI=merchant@ybl
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```
   Application runs on `http://localhost:5173`

---

## 📚 API Endpoints

### User Routes
```
POST   /api/user/register          - Register new user
POST   /api/user/login             - User login
POST   /api/user/logout            - User logout
GET    /api/user/profile           - Get user profile
PUT    /api/user/profile           - Update user profile
```

### Product Routes
```
GET    /api/product/all            - Get all products
GET    /api/product/:id            - Get product details
POST   /api/product                - Create product (seller only)
PUT    /api/product/:id            - Update product (seller only)
DELETE /api/product/:id            - Delete product (seller only)
GET    /api/product/category/:cat  - Get products by category
```

### Cart Routes
```
GET    /api/cart                   - Get user's cart
POST   /api/cart/add               - Add item to cart
PUT    /api/cart/:itemId           - Update cart item quantity
DELETE /api/cart/:itemId           - Remove item from cart
```

### Order Routes
```
POST   /api/order/create           - Create new order
GET    /api/order/my-orders        - Get user's orders
GET    /api/order/:id              - Get order details
GET    /api/order/seller/orders    - Get seller's orders (seller only)
PUT    /api/order/:id/status       - Update order status (seller only)
```

### Address Routes
```
GET    /api/address                - Get user's addresses
POST   /api/address                - Create new address
PUT    /api/address/:id            - Update address
DELETE /api/address/:id            - Delete address
```

### Payment Routes
```
POST   /api/payment/verify         - Verify UPI payment
POST   /api/payment/upi            - Process UPI payment
```

### Seller Routes
```
POST   /api/seller/login           - Seller login
GET    /api/seller/dashboard       - Get seller dashboard data
```

### Transaction Routes
```
GET    /api/transaction/user       - Get user transactions
GET    /api/transaction/seller     - Get seller transactions
```

---

## 🔐 Authentication

- **JWT Tokens** stored in secure HTTP-only cookies
- **User Authentication** - Email/password based login
- **Seller Authentication** - Separate JWT for sellers
- **Protected Routes** - Middleware validates JWT before accessing protected endpoints

---

## 💳 Payment Methods

- **UPI** - Indian payment system with multiple app support (Google Pay, PhonePe, Paytm, BHIM)
- **Cash on Delivery** - COD option for eligible orders

---

## 📦 Key Dependencies

### Backend
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `multer` - File upload handling
- `cloudinary` - Cloud image storage
- `dotenv` - Environment variables

### Frontend
- `react` - UI library
- `react-router-dom` - Routing
- `axios` - HTTP client
- `tailwindcss` - Utility-first CSS
- `shadcn/ui` - Component library
- `react-hot-toast` - Notifications
- `vite` - Build tool

---

## 🚀 Deployment

### Backend Deployment (Vercel)
1. Push code to GitHub
2. Create Vercel project
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Frontend Deployment (Vercel)
1. Push code to GitHub
2. Create Vercel project
3. Configure build settings (Vite)
4. Deploy automatically on push

**Configuration:**
- Ensure `CORS_ORIGIN` matches frontend URL
- Update `.env` variables for production
- Enable HTTPS in production

---

## 📝 Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make Changes**
   - Follow project structure conventions
   - Use TypeScript for type safety
   - Write clean, readable code

3. **Commit Changes**
   ```bash
   git commit -m "feat: describe your changes"
   ```

4. **Push & Create Pull Request**
   ```bash
   git push origin feature/your-feature
   ```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify connection string in `.env`
- Check MongoDB Atlas whitelist includes your IP
- Ensure network access is enabled

### Cloudinary Upload Failures
- Verify API credentials in `.env`
- Check file size limits
- Ensure bucket permissions are correct

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Developer

**Amit Pallai**
- GitHub: [GitHub Profile]
- Email: amitpallai@gmail.com

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## ✅ Checklist for New Users

- [ ] Clone the repository
- [ ] Install Node.js and MongoDB
- [ ] Create Cloudinary account
- [ ] Set up backend `.env` file
- [ ] Set up frontend `.env` file
- [ ] Run `npm install` in both directories
- [ ] Start backend with `npm run dev`
- [ ] Start frontend with `npm run dev`
- [ ] Test payment flows and core features

---

**Last Updated:** April 2026
