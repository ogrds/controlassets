import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../db.json";
import { findFreeId } from "../../../utils";

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    res.status(200).json({
      success: true,
      message: "Data returned successfully",
      companies: db.companies,
    });
  } else if (req.method === "POST") {
    const { name } = req.body;

    if (!req.body) {
      res
        .status(400)
        .json({ success: false, message: "Request body is required" });
    }

    db.companies.push({
      id: findFreeId(db.companies),
      name: String(name),
    });

    res
      .status(201)
      .json({ success: true, message: "Company created successfully" });
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
};
