// src/workers/scoreWorker.js
const { parentPort } = require("worker_threads");
const calculateCompatibility = require("../utils/calculateCompatibility");

parentPort.on("message", ({ loggedUser, targetUser }) => {
  try {
    const score = calculateCompatibility(loggedUser, targetUser);
    parentPort.postMessage({ score });
  } catch (err) {
    parentPort.postMessage({ error: err.message });
  }
});
