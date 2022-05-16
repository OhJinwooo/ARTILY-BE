const { Cluster } = require("ioredis");

const redis = new Cluster([
  {
    host: "localhost",
    port: 6380,
  },
  {
    host: "localhost",
    port: 6381,
  },
]);

module.exports = { redis };
