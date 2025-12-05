// src/modules/systemRoutes/route.service.js
const repository = require("./route.repository");

async function list() {
  return await repository.findAll();
}

module.exports = {
  list,
};
