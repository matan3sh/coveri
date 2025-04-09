/**
 * Logger utility for consistent logging throughout the application
 * Supports different log levels and can be extended to integrate with logging services
 */

// Log levels in order of severity
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  SUCCESS = 2,
  WARN = 3,
  ERROR = 4,
}

// Set the minimum log level based on environment
// In production, we might want to filter out DEBUG logs
const MIN_LOG_LEVEL =
  process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG

// Color codes for console output
const COLORS = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
}

/**
 * Create a timestamp string for the log
 */
function getTimestamp(): string {
  return new Date().toISOString()
}

/**
 * Format a log message with timestamp, module, and level
 */
function formatMessage(level: string, module: string, message: string): string {
  return `${getTimestamp()} [${module}] ${level}: ${message}`
}

// Use unknown instead of any for type-safety
type LogData = unknown

/**
 * Log a message at the specified level
 */
function log(
  level: LogLevel,
  levelName: string,
  module: string,
  message: string,
  data?: LogData
): void {
  // Skip if below minimum log level
  if (level < MIN_LOG_LEVEL) return

  let color = ''
  let logMethod = console.log

  // Set color and console method based on level
  switch (level) {
    case LogLevel.DEBUG:
      color = COLORS.dim
      break
    case LogLevel.INFO:
      color = COLORS.blue
      break
    case LogLevel.SUCCESS:
      color = COLORS.green
      break
    case LogLevel.WARN:
      color = COLORS.yellow
      logMethod = console.warn
      break
    case LogLevel.ERROR:
      color = COLORS.red
      logMethod = console.error
      break
  }

  // Format the message with color
  const formattedMessage = `${color}${formatMessage(
    levelName,
    module,
    message
  )}${COLORS.reset}`

  // Log the message
  if (data !== undefined) {
    logMethod(formattedMessage, data)
  } else {
    logMethod(formattedMessage)
  }
}

/**
 * Create a logger for a specific module
 */
export function createLogger(module: string) {
  return {
    /**
     * Log a debug message (development only)
     */
    debug: (message: string, data?: LogData) => {
      log(LogLevel.DEBUG, 'DEBUG', module, message, data)
    },

    /**
     * Log an info message
     */
    info: (message: string, data?: LogData) => {
      log(LogLevel.INFO, 'INFO', module, message, data)
    },

    /**
     * Log a success message
     */
    success: (message: string, data?: LogData) => {
      log(LogLevel.SUCCESS, 'SUCCESS', module, message, data)
    },

    /**
     * Log a warning message
     */
    warn: (message: string, data?: LogData) => {
      log(LogLevel.WARN, 'WARN', module, message, data)
    },

    /**
     * Log an error message
     */
    error: (message: string, data?: LogData) => {
      log(LogLevel.ERROR, 'ERROR', module, message, data)
    },
  }
}

// Default logger for quick access
export const logger = createLogger('app')
