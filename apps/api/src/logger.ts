// Minimal structured logger. JSON lines to stdout; production
// scrapes/collects them. No extra logging service (2 vCPU budget).
export type LogLevel = "debug" | "info" | "warn" | "error";

export interface Logger {
  debug(msg: string, extra?: Record<string, unknown>): void;
  info(msg: string, extra?: Record<string, unknown>): void;
  warn(msg: string, extra?: Record<string, unknown>): void;
  error(msg: string, extra?: Record<string, unknown>): void;
}

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export function createLogger(service: string, level: LogLevel = "info"): Logger {
  const threshold = LEVEL_ORDER[level];
  const emit = (logLevel: LogLevel, msg: string, extra?: Record<string, unknown>) => {
    if (LEVEL_ORDER[logLevel] < threshold) return;
    const line = JSON.stringify({
      ts: new Date().toISOString(),
      level: logLevel,
      service,
      msg,
      ...extra,
    });
    if (logLevel === "error") process.stderr.write(line + "\n");
    else process.stdout.write(line + "\n");
  };
  return {
    debug: (msg, extra) => emit("debug", msg, extra),
    info: (msg, extra) => emit("info", msg, extra),
    warn: (msg, extra) => emit("warn", msg, extra),
    error: (msg, extra) => emit("error", msg, extra),
  };
}
