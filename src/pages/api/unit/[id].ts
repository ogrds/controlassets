import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../db.json";

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { id } = req.query;

    if (!Number(id)) {
      res
        .status(404)
        .json({ success: false, message: `Unit with id: ${id} not found.` });
    }

    const unit = db.units.find((unit) => unit.id === Number(id));

    if (!unit) {
      res
        .status(404)
        .json({ success: false, message: `Unit with id: ${id} not found.` });
    }

    res.status(200).json({
      success: true,
      message: "Data returned successfully",
      unit,
    });
  } else if (req.method === "POST") {
    const { id } = req.query;
    const { name, image, model, unitId, status, companyId } = req.body;

    if (!req.body) {
      res
        .status(400)
        .json({ success: false, message: "Request body is required" });
    }

    const unit = db.units.find((unit) => unit.id === Number(id));

    if (!unit) {
      res
        .status(404)
        .json({ success: false, message: `Unit with id: ${id} not found.` });
    } else {
      unit.name = String(name);
      unit.companyId = Number(companyId);

      res
        .status(200)
        .json({ success: true, message: "Unit updated successfully" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;

    const unitIndex = db.units.findIndex((unit) => unit.id === Number(id));

    if (unitIndex < 0) {
      res.status(404).json({ error: "Unit not found" });
    }

    db.units.splice(unitIndex, 1);

    res
      .status(200)
      .json({ success: true, message: "Unit deleted successfully" });
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
};
