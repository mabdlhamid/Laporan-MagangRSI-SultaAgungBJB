const express = require("express");
const prisma = require("../lib/prisma");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// semua route di file ini wajib login
router.use(authenticate);

const select = {
  id: true,
  username: true,
  name: true,
  role: true,
  email: true,
  telepon: true,
  institusi: true,
  jurusan: true,
  divisi: true,
  bio: true,
};

// GET /profile → data profil milik user yang sedang login
router.get("/", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select,
    });
    if (!user) return res.status(404).json({ message: "user tidak ditemukan" });
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "terjadi kesalahan server" });
  }
});

const FIELD_TEKS = ["email", "telepon", "institusi", "jurusan", "divisi", "bio"];

// PATCH /profile → ubah profil. Hanya field yang DIKIRIM yang diubah.
router.patch("/", async (req, res) => {
  try {
    const body = req.body || {};
    const data = {};

    if (body.name !== undefined) {
      const name = String(body.name).trim();
      if (!name) return res.status(400).json({ message: "nama tidak boleh kosong" });
      if (name.length > 100) return res.status(400).json({ message: "nama terlalu panjang" });
      data.name = name;
    }

    for (const f of FIELD_TEKS) {
      if (body[f] === undefined) continue;
      const v = String(body[f] ?? "").trim();
      if (v.length > (f === "bio" ? 1000 : 191)) {
        return res.status(400).json({ message: `${f} terlalu panjang` });
      }
      data[f] = v === "" ? null : v; // kosong → NULL di database
    }

    if (data.email) {
      data.email = data.email.toLowerCase();
      if (!/^\S+@\S+\.\S+$/.test(data.email)) {
        return res.status(400).json({ message: "format email tidak valid" });
      }
    }
    if (data.telepon && !/^[0-9+\-\s]{8,16}$/.test(data.telepon)) {
      return res.status(400).json({ message: "nomor telepon tidak valid" });
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "tidak ada data yang diubah" });
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select,
    });
    return res.status(200).json(user);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(400).json({ message: "email sudah digunakan" });
    }
    console.error(err);
    return res.status(500).json({ message: "terjadi kesalahan server" });
  }
});

module.exports = router;