export interface Logger {
  info(msg: string): void
}

export function createLogger() {
  const logger: Logger = {
    info(msg) {
      console.log(msg)
    },
  }

  return logger
}
