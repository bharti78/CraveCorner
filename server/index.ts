import dotenv from "dotenv";
import path from "path";

// Load environment variables - try multiple paths
const envPath = path.join(__dirname, '..', '.env');
const serverEnvPath = path.join(__dirname, '.env');

dotenv.config({ path: envPath });
dotenv.config({ path: serverEnvPath });

// Fallback to default .env loading
dotenv.config();

import express from "express";
import connectDB from "./db/connectDB";

import bodyParser from "body-parser"
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route";
import restaurantRoute from "./routes/restaurant.route";
import menuRoute from "./routes/menu.route";
import orderRoute from "./routes/order.route";
const app = express();


const PORT = process.env.PORT || 3000;


const DIRNAME = path.resolve();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ["https://cravecorner.onrender.com", "https://www.cravecorner.onrender.com"]
    : ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}
app.use(cors(corsOptions));


app.use("/api/v1/user", userRoute);
app.use("/api/v1/restaurant", restaurantRoute);
app.use("/api/v1/menu", menuRoute);
app.use("/api/v1/order", orderRoute);

app.use(express.static(path.join(DIRNAME, "/client/dist")));
app.use("*", (_,res) => {
  res.sendFile(path.resolve(DIRNAME, "client", "dist", "index.html"));
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server listening at port ${PORT}`);  
})
