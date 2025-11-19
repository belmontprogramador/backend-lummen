// src/app.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");

const { requireAuth } = require("./utils/authUser");
const paymentAutoExpire = require("./utils/paymentAutoExpire");

// 🔗 Módulos de rotas
const usersModule = require("./controllers/modules/users");
const passwordResetRoutes = require("./controllers/modules/passwordReset/passwordReset.routes");
const userPreferencesModule = require("./controllers/modules/userPreferences");
const paymentsModule = require("./controllers/modules/payments"); // <- correto
const feedModule = require("./controllers/modules/feed");
const userPhotosModule = require("./controllers/modules/usersPhotos");
const userProfilesModule = require("./controllers/modules/userProfiles");

const matchRoutes = require("./routes/users/match.routes");
const adminRoutes = require("./routes/admins/admin.routes");

dotenv.config({ quiet: true });

const app = express();

/* ================================================
   🧩 Middlewares Globais
================================================ */
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key", "x-locale"],
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================================================
   🔓 ROTAS PÚBLICAS — SEM requireAuth
================================================ */
// login, register, getOne básico
app.use("/users", usersModule);

// reset de senha
app.use("/password", passwordResetRoutes);

// webhook e endpoints públicos de pagamento
app.use("/payments", paymentsModule);

/* ================================================
   🔐 ROTAS PRIVADAS — Protegidas
   requer login → requireAuth
   autovalidação de pagamento → paymentAutoExpire
================================================ */
app.use(requireAuth, paymentAutoExpire);

// módulos privados
app.use("/user-photos", userPhotosModule);
app.use("/user-profiles", userProfilesModule);
app.use("/user-preferences", userPreferencesModule);
app.use("/feed", feedModule);
app.use("/matches", matchRoutes);
app.use("/admins", adminRoutes);

/* ================================================
   🔥 TESTE
================================================ */
app.get("/", (req, res) => res.json({ message: "🔥 API estilo Tinder online!" }));

module.exports = app;
