require("dotenv").config();
const { Worker } = require("bullmq");

const connection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD || undefined,
  tls: process.env.REDIS_TLS === "true" ? {} : undefined,
  maxRetriesPerRequest: null
};

new Worker("emailQueue", async (job) => {
  console.log("📨 Processando email:", job.data);
}, { connection });

new Worker("matchQueue", async (job) => {
  console.log("💘 Match processado:", job.data);
}, { connection });

new Worker("notificationQueue", async (job) => {
  console.log("🔔 Notificação enviada:", job.data);
}, { connection });

console.log("🚀 Workers BullMQ iniciados!");
