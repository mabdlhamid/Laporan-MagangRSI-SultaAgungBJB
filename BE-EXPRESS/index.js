require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const authRouter = require("./routes/auth");
const reportsRouter = require("./routes/reports");
const profileRouter = require("./routes/profile");
const { authenticate, authorize } = require("./middlewares/auth");

const app = express();

// middleware: urutan penting, harus sebelum router
app.use(cors());
app.use(express.json());

// sajikan folder frontend lama (boleh dihapus kalau sudah tidak dipakai)
app.use(express.static(path.join(__dirname, "frontend")));

// halaman utama (menghilangkan "Cannot GET /")
app.get("/", (req, res) => {
  res.json({ message: "API Laporan Magang berjalan" });
});

// pasang router
app.use(authRouter);

// route percobaan untuk mengetes middleware (boleh dihapus nanti)
app.get("/me", authenticate, (req, res) => {
  res.status(200).json(req.user);
});

app.get("/admin", authenticate, authorize("ADMIN"), (req, res) => {
  res.status(200).json({ message: "halo admin" });
});

app.use("/reports", reportsRouter);
app.use("/profile", profileRouter);

const PORT = process.env.PORT || 3000;
module.exports = app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});