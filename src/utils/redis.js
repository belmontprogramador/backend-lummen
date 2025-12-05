require("dotenv").config();
const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD || undefined,
  tls: process.env.REDIS_TLS === "true" ? {} : undefined,
  maxRetriesPerRequest: null, // BullMQ exige isso
  enableReadyCheck: true
});

redis.on("connect", () => console.log("🔥 Redis local conectado com sucesso!"));
redis.on("error", (err) => console.error("❌ Erro Redis:", err));

module.exports = redis;
