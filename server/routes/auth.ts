import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../src/lib/prisma";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-for-mvp";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  
  const token = jwt.sign(
    { id: user.id, role: user.role, officeId: user.officeId },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
  
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

export default router;
