import express from "express";
import { prisma } from "../../src/lib/prisma.ts";
import { authenticate, AuthRequest } from "../middleware/auth.ts";

const router = express.Router();

router.get("/", authenticate, async (req: AuthRequest, res) => {
  const { role, id, officeId } = req.user!;
  
  let where = {};
  if (role === "AGENT") {
    where = { agentId: id };
  } else if (role === "AGENCY_ADMIN" || role === "MARKETING") {
    where = { officeId };
  }
  
  const campaigns = await prisma.campaign.findMany({
    where,
    include: { agent: true, office: true, territories: true },
    orderBy: { createdAt: "desc" }
  });
  
  res.json(campaigns);
});

router.post("/", authenticate, async (req: AuthRequest, res) => {
  const { title, type, objective, printSize, printStock, printQuantity, inHomeDate, territories } = req.body;
  const { id, officeId } = req.user!;
  
  const campaign = await prisma.campaign.create({
    data: {
      title,
      type,
      objective,
      agentId: id,
      officeId: officeId!,
      printSize,
      printStock,
      printQuantity,
      inHomeDate: inHomeDate ? new Date(inHomeDate) : null,
      territories: {
        create: territories.map((t: any) => ({
          name: t.name,
          geoJson: t.geoJson,
          estimatedHouseholds: t.estimatedHouseholds
        }))
      }
    }
  });
  
  res.json(campaign);
});

router.put("/:id/status", authenticate, async (req: AuthRequest, res) => {
  const { status } = req.body;
  const { id } = req.params;
  
  const campaign = await prisma.campaign.update({
    where: { id },
    data: { status }
  });
  
  res.json(campaign);
});

export default router;
