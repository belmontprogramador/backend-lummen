const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path"); 

const usersModule = require("./controllers/modules/users/index");
const userPhotosModule = require("./controllers/modules/usersPhotos/index");

const matchRoutes = require("./routes/users/match.routes");
const adminRoutes = require("./routes/admins/admin.routes");

const { requireApiKey } = require("./utils/apiAuth");

dotenv.config({ quiet: true });

const app = express();
app.use(morgan("dev"));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','PATCH','DELETE'],
  allowedHeaders: ['Content-Type','Authorization','x-api-key'],
}));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




app.use("/users", usersModule);
app.use("/user-photos", userPhotosModule);

app.use("/matches", matchRoutes);
app.use("/admins", adminRoutes);

app.get("/", (req, res) => res.json({ message: "🔥 API estilo Tinder online!ta mesmo" }));

module.exports = app;
