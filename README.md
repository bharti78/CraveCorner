# 🍕 CraveCorner - Food Delivery Platform

A modern, full-stack food delivery web application built with React, Node.js, and TypeScript. Order delicious food from your favorite restaurants anytime and anywhere with secure payments and real-time order tracking!

[![Live Demo](https://img.shields.io/badge/Live%20Demo-CraveCorner-brightgreen)](https://cravecorner.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/bharti78/CraveCorner)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## ✨ Features

- 🍕 **Restaurant Search & Filtering** - Find restaurants by name, city, and cuisine
- 🔐 **User Authentication** - Secure login/signup with email verification
- 🛒 **Shopping Cart** - Add items and manage your order
- 💳 **Secure Payments** - Stripe integration for safe transactions
- 📱 **Responsive Design** - Works perfectly on all devices
- 🖼️ **Image Upload** - Cloudinary integration for menu and profile images
- 📧 **Email Notifications** - Order confirmations and password reset
- 📊 **Order Management** - Track orders and manage restaurant orders
- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **TypeScript** - Type safety and better development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Radix UI** - Accessible component primitives

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Type safety for server-side code
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Multer** - File upload middleware
- **bcryptjs** - Password hashing

### Services & Tools
- **Stripe** - Payment processing and checkout
- **Cloudinary** - Cloud image and video management
- **Mailtrap** - Email testing and delivery
- **Render** - Cloud deployment platform
- **GitHub** - Version control and CI/CD

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** database (local or Atlas)
- **Stripe** account for payments
- **Cloudinary** account for image storage
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bharti78/CraveCorner.git
   cd CraveCorner
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client && npm install
   cd ..
   ```

3. **Run the application**

   **Development (Both client and server):**
   ```bash
   npm run dev:full
   ```

   **Development (Server only):**
   ```bash
   npm run dev
   ```

   **Development (Client only):**
   ```bash
   npm run dev:client
   ```

       **Production:**
    ```bash
    npm run build
    npm run start
    ```

    **Note:** 
    - `npm run build` - Compiles TypeScript to JavaScript and builds client
    - `npm run start` - Runs the compiled server with increased memory limit
    - Server runs on port 8000 with MongoDB connection

## 📁 Project Structure

```
CraveCorner/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/           # Base UI components (buttons, inputs, etc.)
│   │   │   └── ...           # Feature-specific components
│   │   ├── store/            # Zustand state management
│   │   ├── auth/             # Authentication pages & logic
│   │   ├── admin/            # Admin dashboard components
│   │   ├── assets/           # Static assets (images, icons)
│   │   └── main.tsx          # Application entry point
│   ├── public/               # Public assets
│   ├── package.json          # Frontend dependencies
│   └── vite.config.ts        # Vite configuration
├── server/                   # Node.js backend
│   ├── controller/           # Route controllers (business logic)
│   ├── models/              # MongoDB schemas & models
│   ├── routes/              # API route definitions
│   ├── middlewares/         # Custom middleware functions
│   ├── utils/               # Utility functions & helpers
│   ├── db/                  # Database connection
│   ├── index.ts             # Server entry point
│   └── tsconfig.json        # TypeScript configuration
├── .env                      # Environment variables (not in repo)
├── package.json             # Root dependencies & scripts
└── README.md               # Project documentation
```

## 🔧 Available Scripts

### Development Scripts
- `npm run dev` - Start development server with nodemon
- `npm run dev:client` - Start React development server (Vite)
- `npm run dev:server` - Start Node.js development server
- `npm run dev:full` - Start both client and server simultaneously

### Production Scripts
- `npm run build` - Build for production (TypeScript compilation + client build)
- `npm run start` - Start production server (runs compiled JavaScript with 4GB memory)

## 🌐 API Endpoints

### Authentication
- `POST /api/v1/user/signup` - User registration with email verification
- `POST /api/v1/user/login` - User login with JWT token
- `POST /api/v1/user/logout` - User logout and token invalidation
- `GET /api/v1/user/check-auth` - Verify authentication status
- `POST /api/v1/user/verify-email` - Email verification endpoint

### Restaurants
- `GET /api/v1/restaurant/` - Get all restaurants with pagination
- `POST /api/v1/restaurant/` - Create new restaurant (admin only)
- `PUT /api/v1/restaurant/` - Update restaurant details
- `GET /api/v1/restaurant/search/:searchText` - Search restaurants by name/city

### Menu Management
- `POST /api/v1/menu/` - Add new menu item with image upload
- `PUT /api/v1/menu/:id` - Update menu item details
- `DELETE /api/v1/menu/:id` - Delete menu item

### Orders & Payments
- `POST /api/v1/order/checkout/create-checkout-session` - Create Stripe payment session
- `GET /api/v1/order/` - Get user's order history
- `POST /api/v1/order/webhook` - Stripe webhook for payment confirmation

## 🚀 Deployment

The application is deployed on **Render**:

- **Live Site:** [https://cravecorner.onrender.com](https://cravecorner.onrender.com)
- **Auto-deploy:** Enabled on commit to main branch
- **Status:** ✅ Successfully deployed and running
- **Port:** 8000 (automatically detected by Render)
- **Memory:** 4GB allocation for optimal performance
- **Database:** MongoDB Atlas connected successfully

## 📸 Screenshots

### 🏠 Homepage
<img width="1898" height="911" alt="image" src="https://github.com/user-attachments/assets/3cb96a34-7131-4555-b771-3c50e03c4bf0" />

### 🔐 Authentication
<img width="748" height="512" alt="image" src="https://github.com/user-attachments/assets/fa19b5e0-830a-4aa8-8dc7-4e7009bdf7a6" />

### 🍕 Restaurant Details
<img width="1698" height="911" alt="image" src="https://github.com/user-attachments/assets/a9c72690-8b48-47a2-8eab-5098edacaf38" />

### 🛒 Shopping Cart
<img width="1717" height="592" alt="image" src="https://github.com/user-attachments/assets/8160ed4a-415a-4609-a118-ce2206d8d0f2" />

### 💳 Payment Checkout
<img width="1259" height="893" alt="image" src="https://github.com/user-attachments/assets/2648653d-0de3-4f19-8909-84de3feb3ce3" />

*Note: Replace placeholder images with actual screenshots of your application*

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Bharti Dhote** 🚀
- **GitHub:** [@bharti78](https://github.com/bharti78)
- **LinkedIn:** [Connect with me](https://linkedin.com/in/bharti-dhote)
- **Portfolio:** [View my work](https://bharti78.github.io)

*Passionate full-stack developer creating innovative web solutions*

## 🙏 Acknowledgments

### 🛠️ Technologies & Libraries
- [Stripe](https://stripe.com/) - Secure payment processing
- [Cloudinary](https://cloudinary.com/) - Cloud image management
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vite](https://vitejs.dev/) - Next-generation build tool
- [React](https://reactjs.org/) - UI library
- [Node.js](https://nodejs.org/) - JavaScript runtime
- [MongoDB](https://mongodb.com/) - NoSQL database

### 🎨 UI Components
- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- [Lucide React](https://lucide.dev/) - Beautiful icons
- [Sonner](https://sonner.emilkowal.ski/) - Toast notifications

### 🚀 Deployment & Tools
- [Render](https://render.com/) - Cloud deployment platform
- [GitHub](https://github.com/) - Version control and collaboration
- [TypeScript](https://www.typescriptlang.org/) - Type safety

---

⭐ Star this repository if you found it helpful! 
