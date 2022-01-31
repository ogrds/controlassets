import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../db.json";

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { id } = req.query;

    if (!Number(id)) {
      res
        .status(404)
        .json({ success: false, message: `Asset with id: ${id} not found.` });
    }

    const asset = db.assets.find((asset) => asset.id === Number(id));

    if (!asset) {
      res
        .status(404)
        .json({ success: false, message: `Asset with id: ${id} not found.` });
    }

    res.status(200).json({
      success: true,
      message: "Data returned successfully",
      asset,
    });
  } else if (req.method === "POST") {
    const { id } = req.query;
    const { name, image, model, unitId, status, companyId } = req.body;

    if (!req.body) {
      res
        .status(400)
        .json({ success: false, message: "Request body is required" });
    }

    const asset = db.assets.find((asset) => asset.id === Number(id));

    if (!asset) {
      res
        .status(404)
        .json({ success: false, message: `Asset with id: ${id} not found.` });
    } else {
      asset.model = String(model);
      asset.status = String(status);
      asset.name = String(name);
      asset.image = String(image);
      asset.unitId = Number(unitId);
      asset.companyId = Number(companyId);

      res
        .status(200)
        .json({ success: true, message: "Asset updated successfully" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;

    const assetIndex = db.assets.findIndex((asset) => asset.id === Number(id));

    if (assetIndex < 0) {
      res.status(404).json({ error: "Asset not found" });
    }

    db.assets.splice(assetIndex, 1);

    res
      .status(200)
      .json({ success: true, message: "Asset deleted successfully" });
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
};
