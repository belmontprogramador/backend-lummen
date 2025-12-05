const { createClient } = require("redis");

const client = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379"
});

// logs úteis
client.on("connect", () => {
  console.log("🔥 Redis conectado com sucesso!");
});

client.on("error", (err) => {
  console.error("❌ Erro no Redis:", err);
});

// garante conexão antes do uso
(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error("❌ Falha ao conectar no Redis:", err);
  }
})();

module.exports = client;
