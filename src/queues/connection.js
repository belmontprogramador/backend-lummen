module.exports = {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
    tls: process.env.REDIS_TLS === "true" ? {} : undefined,
  },
};
