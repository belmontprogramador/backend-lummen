// src/dataBase/prisma.js
const { PrismaClient } = require('../../generated/prisma'); // <-- AQUI é o segredo

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

module.exports = { prisma };
