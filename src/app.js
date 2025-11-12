const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path"); 

const userRoutes = require("./routes/users/user.routes");
const matchRoutes = require("./routes/users/match.routes");
const adminRoutes = require("./routes/admins/admin.routes");

const { requireApiKey } = require("./utils/apiAuth");

dotenv.config({ quiet: true });

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use("/users", userRoutes);
app.use("/matches", matchRoutes);
app.use("/admins", adminRoutes);

app.get("/", (req, res) => res.json({ message: "🔥 API estilo Tinder online!" }));

module.exports = app;
