const { ExpressAdapter } = require("@bull-board/express");
const { createBullBoard } = require("@bull-board/api");
const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter");

const { matchQueue, emailQueue, notificationQueue } = require("./index");
const compatibilityQueue = require("./compatibility.queue");
const likeQueue = require("./like.queue");
const dislikeQueue = require("./dislike.queue");
const skipQueue = require("./skip.queue");

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [
    new BullMQAdapter(matchQueue),
    new BullMQAdapter(emailQueue),
    new BullMQAdapter(notificationQueue),
    new BullMQAdapter(compatibilityQueue),
    new BullMQAdapter(likeQueue),
    new BullMQAdapter(dislikeQueue),
    new BullMQAdapter(skipQueue),
  ],
  serverAdapter,
});

module.exports = serverAdapter;
