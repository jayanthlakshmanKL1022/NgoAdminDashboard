import express from "express";
import mongoose from "mongoose";
import NgoRouter from "./Routes/NgoFormRoute";
import cors from "cors";
import adminRouter from "./Routes/AuthController";
const app = express();
app.use(express.json());
app.use(cors());
//didnt set as env,i created this MongoDB cluster entirely for this Project.
const MONGO_URL = "mongodb+srv://jayanthlakshman168_db_user:sample@cluster0.hi8an81.mongodb.net/?appName=Cluster0";
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));
 //DEFINING THE ROUTES ASSOSCIATED FOR EACH PAGE.
 app.use("/ngo",NgoRouter)
 app.use('/auth',adminRouter)
app.get("/", (req, res) => {
  res.send("API running...");
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

