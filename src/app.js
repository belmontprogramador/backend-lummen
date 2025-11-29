// src/app.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");

// Middlewares
const { requireAuth } = require("./middleware/authUser");
const checkSubscription = require("./middleware/checkSubscription");

// Módulos de rotas públicas
const usersModule = require("./controllers/modules/users");
const passwordResetRoutes = require("./controllers/modules/passwordReset/passwordReset.routes");
const paymentsModule = require("./controllers/modules/payments");
const adminRoutes = require("./controllers/modules/admins/");
const plansModule = require("./controllers/modules/plans");
const adminUsersModule = require("./controllers/modules/adminUsers");
const blogAuthModule = require("./controllers/modules/blogAuth");
const blogCategoriesModule = require("./controllers/modules/blogCategories");

// Módulos privados
const userPreferencesModule = require("./controllers/modules/userPreferences");
const feedModule = require("./controllers/modules/feed");
const likesModule = require("./controllers/modules/likes");
const userPhotosModule = require("./controllers/modules/usersPhotos");
const userProfilesModule = require("./controllers/modules/userProfiles");
const matchRoutes = require("./routes/users/match.routes");
const messagesModule = require("./controllers/modules/messages");
const blogRoutes = require("./controllers/modules/blogPosts");



dotenv.config({ quiet: true });

const app = express();

 
   //🧩 GLOBAL MIDDLEWARES
 
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

 
   //🔓 ROTAS PÚBLICAS
 
// login / register / verify / admin login
app.use("/users", usersModule);
app.use("/admins", adminRoutes);
app.use("/admin-users", adminUsersModule); 
app.use("/plans", plansModule);
app.use("/blog-auth", blogAuthModule);
app.use("/blog-categories", blogCategoriesModule);
app.use("/blog-post", blogRoutes )

// reset password
app.use("/password", passwordResetRoutes);

// webhook / pagamentos externos
app.use("/payments", paymentsModule);
 
//PROTEÇÃO GLOBAL — APÓS requireAuth
 
app.use(requireAuth);
// 🔥 Expiração automática + migração para FREE
app.use(checkSubscription);


//rotas privadas
app.use("/user-photos", userPhotosModule);
app.use("/user-profiles", userProfilesModule);
app.use("/user-preferences", userPreferencesModule);
app.use("/feed", feedModule);
app.use("/likes", likesModule); // 👈 adiciona o módulo aqui
app.use("/matches", matchRoutes);
app.use("/messages", messagesModule);





/* ================================================
   🔥 TESTE
================================================ */
app.get("/", (req, res) => res.json({ message: "🔥 API estilo Tinder online!" }));

module.exports = app;
