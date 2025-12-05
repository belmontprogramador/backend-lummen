require("dotenv").config();
const { Queue } = require("bullmq");
const redis = require("../utils/redis");

const connection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD || undefined,
  tls: process.env.REDIS_TLS === "true" ? {} : undefined,
  maxRetriesPerRequest: null
};

const matchQueue = new Queue("matchQueue", { connection });
const emailQueue = new Queue("emailQueue", { connection });
const notificationQueue = new Queue("notificationQueue", { connection });

module.exports = {
  matchQueue,
  emailQueue,
  notificationQueue,
};
