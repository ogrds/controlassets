import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../db.json";
import { findFreeId } from "../../../utils";

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    res.status(200).json({
      success: true,
      message: "Data returned successfully",
      assets: db.assets,
    });
  } else if (req.method === "POST") {
    const { name, image, model, unitId, companyId } = req.body;

    if (!req.body) {
      res
        .status(400)
        .json({ success: false, message: "Request body is required" });
    }

    db.assets.push({
      id: findFreeId(db.assets),
      sensors: ["GSJ1535"],
      model: String(model),
      status: "inOperation",
      healthscore: Math.floor(Math.random() * (100 - 30 + 1)) + 30,
      name: String(name),
      image: String(image),
      specifications: {
        maxTemp: Math.floor(Math.random() * (200 - 50 + 1)) + 50,
        power: Math.floor(Math.random() * (1000 - 0 + 1)) + 0,
        rpm: Math.floor(Math.random() * (10000 - 0 + 1)) + 0,
      },
      metrics: {
        totalCollectsUptime: Math.floor(Math.random() * (5000 - 50 + 1)) + 50,
        totalUptime: Math.floor(Math.random() * (15000 - 0 + 1)) + 0,
        lastUptimeAt: String(new Date()),
      },
      unitId: Number(unitId),
      companyId: Number(companyId),
    });

    res
      .status(201)
      .json({ success: true, message: "Asset created successfully" });
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
};
