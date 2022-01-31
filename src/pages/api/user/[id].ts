import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../db.json";

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { id } = req.query;

    if (!Number(id)) {
      res
        .status(404)
        .json({ success: false, message: `User with id: ${id} not found.` });
    }

    const user = db.users.find((user) => user.id === Number(id));

    if (!user) {
      res
        .status(404)
        .json({ success: false, message: `User with id: ${id} not found.` });
    }

    res.status(200).json({
      success: true,
      message: "Data returned successfully",
      user,
    });
  } else if (req.method === "POST") {
    const { id } = req.query;
    const { name, email, unitId, companyId } = req.body;

    if (!req.body) {
      res
        .status(400)
        .json({ success: false, message: "Request body is required" });
    }

    const user = db.users.find((user) => user.id === Number(id));

    if (!user) {
      res
        .status(404)
        .json({ success: false, message: `User with id: ${id} not found.` });
    } else {
      user.email = String(email);
      user.name = String(name);
      user.unitId = Number(unitId);
      user.companyId = Number(companyId);

      res
        .status(200)
        .json({ success: true, message: "User updated successfully" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;

    const userIndex = db.users.findIndex((user) => user.id === Number(id));

    if (userIndex < 0) {
      res.status(404).json({ error: "User not found" });
    }

    db.users.splice(userIndex, 1);

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
};
