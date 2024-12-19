// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import jwt from "jsonwebtoken";

export default function handler(req, res) {
  let token = jwt.sign({id: process.env.ADMIN_ID}, process.env.JWT_KEY);
  res.status(200).json({ name: "John Doe", token });
}
