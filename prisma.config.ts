// prisma.config.ts
import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";

// carrega as variáveis do arquivo .env na raiz
dotenv.config({ path: ".env" });

export default defineConfig({
  schema: "./prisma/schema.prisma",
});
