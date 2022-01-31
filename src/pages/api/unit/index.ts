import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../db.json";
import { findFreeId } from "../../../utils";

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    res.status(200).json({
      success: true,
      message: "Data returned successfully",
      units: db.units,
    });
  } else if (req.method === "POST") {
    const { name, companyId } = req.body;

    if (!req.body) {
      res
        .status(400)
        .json({ success: false, message: "Request body is required" });
    }

    db.units.push({
      id: findFreeId(db.units),
      name: String(name),
      companyId: Number(companyId),
    });

    res
      .status(201)
      .json({ success: true, message: "Unit created successfully" });
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
};
