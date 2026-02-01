const noop = (..._args: unknown[]) => {}

interface LoggerScope {
  info: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
  scope: (name: string) => LoggerScope
}

const createScope = (prefix: string): LoggerScope => ({
  info: (...args) => console.info(`[${prefix}]`, ...args),
  warn: (...args) => console.warn(`[${prefix}]`, ...args),
  error: (...args) => console.error(`[${prefix}]`, ...args),
  scope: (name) => createScope(`${prefix}:${name}`)
})

const log = {
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
  debug: console.debug.bind(console),
  verbose: noop,
  silly: noop,
  scope: (name: string) => createScope(name),
  transports: {}
}

export default log
