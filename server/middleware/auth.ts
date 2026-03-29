import { Request, Response, NextFunction } from "express";
import { prisma } from "../../src/lib/prisma.ts";

export interface AuthRequest extends Request {
  user?: { id: string; role: string; officeId?: string | null };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // For MVP/Demo: Automatically use the first user in the database
    const user = await prisma.user.findFirst();
    if (!user) {
      return res.status(500).json({ error: "No users found in database. Please run seed script." });
    }
    
    req.user = {
      id: user.id,
      role: user.role,
      officeId: user.officeId
    };
    next();
  } catch (error) {
    res.status(500).json({ error: "Authentication bypass failed" });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
};
