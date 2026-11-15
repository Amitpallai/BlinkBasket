# BlinkBasket

BlinkBasket is a polished full-stack grocery e-commerce application that connects customers with sellers for browsing, ordering, and inventory management.
<img width="1902" height="966" alt="Screenshot 2026-11-14 232728" src="https://github.com/user-attachments/assets/21c5bad0-b514-4db6-838b-12162584c85a" />
<img width="1917" height="1078" alt="Screenshot 2026-11-14 232703" src="https://github.com/user-attachments/assets/b32dc1c6-9d24-4d98-8104-86d71f985b6e" />

The platform includes:
- A customer storefront for product discovery, cart management, checkout, and order tracking.
- A seller dashboard for product management, stock control, and order fulfillment.
- Image upload support via Cloudinary and payment integration via UPI.

---

## ✨ Features

### Customer Experience
- Browse products by category
- View product details with images
- Add products to cart and update quantities
- Save delivery addresses
- Place orders using UPI or Cash on Delivery
- Track order history and order status
- User registration, login, and profile management

### Seller/Admin Experience
- Secure seller authentication
- Add, edit, and delete products
- Manage inventory and product availability
- View and process customer orders
- Track transactions and sales
- Cloudinary image uploads for product media

---

## 🛠️ Technology Stack

- client: React, TypeScript, Vite, Tailwind CSS
- server: Node.js, Express, TypeScript
- Database: MongoDB with Mongoose
- Authentication: JWT
- File Uploads: Multer + Cloudinary
- Payments: UPI integration
- Deployment: Docker, Docker Compose

---

## 📁 Project Structure

```
BlinkBasket/
├── server/
│   ├── src/
│   │   ├── config/          # Application configuration (CORS, environment, services)
│   │   ├── configs/         # Provider setup (database, Cloudinary, Multer)
│   │   ├── controllers/     # Route handlers
│   │   ├── middlewares/     # Authentication and request middleware
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── uploads/         # Temporary upload storage
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # server entrypoint
│   ├── package.json
│   └── tsconfig.json
│
├── client/
│   ├── src/
│   │   ├── app/             # Providers and routing
│   │   ├── assets/          # Static assets
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Global state management
│   │   ├── features/        # Feature-specific modules
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utility functions
│   │   ├── Pages/           # Page components
│   │   ├── types/           # TypeScript definitions
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/              # Static public files
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── .dockerignore
│   ├── .env.example
│   └── .env
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v16 or later
- npm
- MongoDB (local or Atlas)
- Cloudinary account for image uploads
- Docker Desktop for containerized deployment

### server Setup

```bash
cd server
npm install
cp .env.example .env
```

Update `.env` with your configuration values, including:
- `MONGODB_URL`
- `JWT_SECRET`
- `SELLER_JWT`
- `SELLER_EMAIL`
- `SELLER_PASSWORD`
- `DEMO_USER_NAME`, `DEMO_USER_EMAIL`, and `DEMO_USER_PASSWORD`
- `DEMO_SELLER_EMAIL` and `DEMO_SELLER_PASSWORD`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Start the server server:

```bash
npm run dev
```

server API: `http://localhost:4000`

### client Setup

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

The `VITE_DEMO_*` values in `client/.env` must match the corresponding demo credentials in `server/.env`.

client app: `http://localhost:5173`

---

## 🐳 Docker Setup

Run the app with Docker Compose:

```bash
docker compose up --build
```

Open the app at:
- client: `http://localhost:5173`
- server: `http://localhost:4000`

Stop the services:

```bash
docker compose down
```

---

## 📌 Available Scripts

### server
- `npm run dev` — Start server in development mode
- `npm run build` — Compile TypeScript
- `npm start` — Run the compiled server

### client
- `npm run dev` — Start the Vite development server
- `npm run build` — Build the production bundle
- `npm run preview` — Preview the production build
- `npm run lint` — Lint the client codebase

---

## 💡 Notes

- Keep secrets safe in production.
- Confirm that MongoDB and Cloudinary credentials are correct.
- For MongoDB Atlas, whitelist the app server IP.

---

## 📄 License

This project is available under the MIT License.

> server uses `server/.env` for runtime secrets. Copy `server/.env.example` and fill in your MongoDB and Cloudinary values before running Docker.

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

### server
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `multer` - File upload handling
- `cloudinary` - Cloud image storage
- `dotenv` - Environment variables

### client
- `react` - UI library
- `react-router-dom` - Routing
- `axios` - HTTP client
- `tailwindcss` - Utility-first CSS
- `shadcn/ui` - Component library
- `sonner` - Notifications
- `vite` - Build tool

---

## 🚀 Deployment

### server Deployment (Vercel)
1. Push code to GitHub
2. Create Vercel project
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### client Deployment (Vercel)
1. Push code to GitHub
2. Create Vercel project
3. Configure build settings (Vite)
4. Deploy automatically on push

**Configuration:**
- Ensure `CORS_ORIGIN` matches client URL
- Update `.env` variables for production
- Enable HTTPS in production
- Set the `DEMO_*` variables in the server project and matching `VITE_DEMO_*` variables in the client project.
- Demo credentials are public. The demo seller has full access to the connected store, including products, stock, and orders; do not reuse real seller credentials.

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
- [ ] Set up server `.env` file
- [ ] Set up client `.env` file
- [ ] Run `npm install` in both directories
- [ ] Start server with `npm run dev`
- [ ] Start client with `npm run dev`
- [ ] Test payment flows and core features

---

**Last Updated:** April 2026
