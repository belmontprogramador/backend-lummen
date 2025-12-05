const { ExpressAdapter } = require("@bull-board/express");
const { createBullBoard } = require("@bull-board/api");
const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter");

const { matchQueue, emailQueue, notificationQueue } = require("./index");
const compatibilityQueue = require("./compatibility.queue");

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [
    new BullMQAdapter(matchQueue),
    new BullMQAdapter(emailQueue),
    new BullMQAdapter(notificationQueue),
    new BullMQAdapter(compatibilityQueue),
  ],
  serverAdapter,
});

module.exports = serverAdapter;
