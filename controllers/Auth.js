import argon2 from "argon2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import Admin from "../models/AdminModel.js";

export const register = async (req, res) => {
  const { name, email, role, password, confPassword } = req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "password dan confirm password tidak cocok" });
  try {
    const existingAdmin = await Admin.findOne({
      where: {
        email: email,
      },
    });
    if (existingAdmin)
      return res.status(400).json({ msg: "Email sudah terdaftar." });
    const hashPassword = await argon2.hash(password);
    await Admin.create({
      name: name,
      email: email,
      role: role,
      password: hashPassword,
    });
    res.json({ msg: "Register berhasil!" });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      where: {
        email: req.body.email,

      },
    });
    if (!admin) return res.status(404).json({ msg: "Email tidak terdaftar" });
    const match = await argon2.verify(admin.password, req.body.password);
    if (!match) return res.status(400).json({ msg: "Wrong password!" });
    const id = admin.id;
    const name = admin.name;
    const email = admin.email;
    const role = admin.role;
    const accessToken = jwt.sign(
      { id, name, email, role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const refreshToken = jwt.sign(
      { id, name, email, role },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    await Admin.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: id,
        },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ status:"true",logged:"true",message: "Login success", token: accessToken });
  } catch (error) {
    res.json({ error });
    console.log(error);
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const admin = await Admin.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!admin[0]) return res.sendStatus(204);
  const adminId = admin[0].id;
  await Admin.update(
    { refresh_token: null },
    {
      where: {
        id: adminId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};
