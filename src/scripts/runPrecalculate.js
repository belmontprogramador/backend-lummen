const { precalculateCompatibility } = require("../jobs/precalculateCompatibility");

(async () => {
  const userId = process.argv[2];

  if (!userId) {
    console.error("❌ Passe o ID do usuário: node runPrecalculate.js <userId>");
    process.exit(1);
  }

  await precalculateCompatibility(userId);
  process.exit(0);
})();
