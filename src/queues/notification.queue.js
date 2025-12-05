const { Queue } = require("bullmq");

const connection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD || undefined,
  tls: process.env.REDIS_TLS === "true" ? {} : undefined,
  maxRetriesPerRequest: null, // obrigatório no BullMQ
};

const notificationQueue = new Queue("notificationQueue", {
  connection,
});

module.exports = notificationQueue;
