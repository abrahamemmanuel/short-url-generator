const TYPES = {
  Logger: Symbol.for("Logger"),
  KnexDB: Symbol.for("KnexDB"),
  Redis: Symbol.for("Redis"),
  TokenStore: Symbol.for("TokenStore"),
  AMQPChannel: Symbol.for("AMQPChannel"),
  Channel: Symbol.for("Channel"),
  HTTPAgent: Symbol.for("HTTPAgent")
};

export default TYPES;
