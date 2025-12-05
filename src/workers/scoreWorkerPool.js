// src/workers/scoreWorkerPool.js
const { Worker } = require("worker_threads");
const os = require("os");
const path = require("path");

const WORKERS = Math.max(2, os.cpus().length - 1);
const workers = [];
const queue = [];

/**
 * Criar um novo worker com listeners e auto-reload
 */
function createWorker() {
  const workerPath = path.join(__dirname, "scoreWorker.js");
  const worker = new Worker(workerPath);

  worker.isBusy = false;

  console.log("⚙️ Worker criado:", worker.threadId);

  // 🔥 AUTO-RELOAD: se morrer, recria automaticamente
  worker.on("exit", (code) => {
    console.log(`❌ Worker ${worker.threadId} morreu (code ${code}). Criando outro...`);
    replaceWorker(worker);
  });

  // Segurança extra: captura erro interno
  worker.on("error", (err) => {
    console.log(`🔥 ERRO no worker ${worker.threadId}:`, err);
    replaceWorker(worker);
  });

  return worker;
}

/**
 * Substitui um worker morto
 */
function replaceWorker(deadWorker) {
  const index = workers.indexOf(deadWorker);
  if (index === -1) return;

  const newWorker = createWorker();
  workers[index] = newWorker;

  console.log(`🔄 Worker substituído → novo threadId: ${newWorker.threadId}`);

  // Se há tasks na fila, tentar processar imediatamente
  processNextInQueue();
}

/**
 * Seleciona um worker livre e envia a próxima task
 */
function processNextInQueue() {
  const available = workers.find(w => !w.isBusy);
  if (!available) return;

  const next = queue.shift();
  if (!next) return;

  executeTask(available, next.task, next.resolve, next.reject);
}

/**
 * Envia uma task para o worker
 */
function executeTask(worker, task, resolve, reject) {
  worker.isBusy = true;

  worker.once("message", (result) => {
    worker.isBusy = false;

    // Processar próxima task da fila
    processNextInQueue();

    if (result.error) return reject(result.error);
    return resolve(result.score);
  });

  worker.postMessage(task);
}

/**
 * API pública usada no feed.service
 */
function runTask(task) {
  return new Promise((resolve, reject) => {
    const available = workers.find(w => !w.isBusy);

    if (!available) {
      queue.push({ task, resolve, reject });
      return;
    }

    executeTask(available, task, resolve, reject);
  });
}

/**
 * Inicializa os workers no startup
 */
for (let i = 0; i < WORKERS; i++) {
  workers.push(createWorker());
}

console.log(`🚀 Worker Pool inicializada com ${WORKERS} workers.`);

module.exports = { runTask };
