import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
const JWT_SECRET = "adminkey123";
interface AdminPayload extends JwtPayload {
  username: string;
  role: string;
}
//creating MiddleWare to handle only ADMINS.
export const verifyAdminToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as AdminPayload;
    if (!decoded.username || decoded.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
