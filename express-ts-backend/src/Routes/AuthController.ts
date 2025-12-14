import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
const JWT_SECRET = "adminkey123"; 
const JWT_EXPIRES_IN = "1d";
const adminRouter = Router();
adminRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }
    if (username !== "admin" || password !== "admin123") {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        username: "admin",
        role: "ADMIN",
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default adminRouter;
