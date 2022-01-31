import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../db.json";
import { findFreeId } from "../../../utils";

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    res.status(200).json({
      success: true,
      message: "Data returned successfully",
      users: db.users,
    });
  } else if (req.method === "POST") {
    const { name, email, unitId, companyId } = req.body;

    if (!req.body) {
      res
        .status(400)
        .json({ success: false, message: "Request body is required" });
    }

    db.users.push({
      id: findFreeId(db.users),
      email: String(email),
      name: String(name),
      unitId: Number(unitId),
      companyId: Number(companyId),
    });

    res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
};
