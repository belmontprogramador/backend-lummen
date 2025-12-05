// src/jobs/state/precalcState.js

// Armazena usuários que estão em pré-cálculo ativo
const running = new Set();

/**
 * Verifica se o usuário já está com pré-cálculo rodando
 */
function isRunning(userId) {
  return running.has(userId);
}

/**
 * Marca que o usuário iniciou o pré-cálculo
 */
function start(userId) {
  running.add(userId);
}

/**
 * Marca que o pré-cálculo terminou
 */
function stop(userId) {
  running.delete(userId);
}

module.exports = {
  isRunning,
  start,
  stop,
}