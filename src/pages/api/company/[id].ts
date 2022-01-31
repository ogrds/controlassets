import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../db.json";

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { id } = req.query;

    if (!Number(id)) {
      res
        .status(404)
        .json({ success: false, message: `Company with id: ${id} not found.` });
    }

    const company = db.companies.find((company) => company.id === Number(id));

    if (!company) {
      res
        .status(404)
        .json({ success: false, message: `Company with id: ${id} not found.` });
    }

    res.status(200).json({
      success: true,
      message: "Data returned successfully",
      company,
    });
  } else if (req.method === "POST") {
    const { id } = req.query;
    const { name } = req.body;

    if (!req.body) {
      res
        .status(400)
        .json({ success: false, message: "Request body is required" });
    }

    const company = db.companies.find((company) => company.id === Number(id));

    if (!company) {
      res
        .status(404)
        .json({ success: false, message: `Company with id: ${id} not found.` });
    } else {
      company.name = String(name);

      res
        .status(200)
        .json({ success: true, message: "Company updated successfully" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;

    const companyIndex = db.companies.findIndex(
      (company) => company.id === Number(id)
    );

    if (companyIndex < 0) {
      res.status(404).json({ error: "Company not found" });
    }

    db.companies.splice(companyIndex, 1);

    res
      .status(200)
      .json({ success: true, message: "Company deleted successfully" });
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
};
