const helmet = require("helmet");
const compression = require("compression");

const production = (app) => {
  app.use(helmet());
  app.use(compression());
};

module.exports = production;
