// utils/logger.js — simple structured logger
// Replace with winston or pino for production log management

const isDev = process.env.NODE_ENV !== "production";

const logger = {
  info: (...args) => {
    if (isDev) console.info("[INFO]", new Date().toISOString(), ...args);
  },
  warn: (...args) => {
    console.warn("[WARN]", new Date().toISOString(), ...args);
  },
  error: (...args) => {
    console.error("[ERROR]", new Date().toISOString(), ...args);
  },
};

module.exports = logger;
