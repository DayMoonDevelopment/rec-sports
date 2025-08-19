interface LoggerConfig {
  enableLog?: boolean;
  enableWarn?: boolean;
  enableError?: boolean;
  forceAll?: boolean;
}

class Logger {
  private config: LoggerConfig = {
    enableLog: __DEV__,
    enableWarn: __DEV__,
    enableError: true,
    forceAll: false,
  };

  /**
   * Configure logger behavior
   * @param config - Configuration options
   */
  configure(config: Partial<LoggerConfig>) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Reset logger to default configuration
   */
  reset() {
    this.config = {
      enableLog: __DEV__,
      enableWarn: __DEV__,
      enableError: true,
      forceAll: false,
    };
  }

  /**
   * Log message - only in dev mode unless overridden
   */
  log(...args: any[]) {
    if (this.config.forceAll || this.config.enableLog) {
      console.log(...args);
    }
  }

  /**
   * Warn message - only in dev mode unless overridden
   */
  warn(...args: any[]) {
    if (this.config.forceAll || this.config.enableWarn) {
      console.warn(...args);
    }
  }

  /**
   * Error message - always runs unless explicitly disabled
   */
  error(...args: any[]) {
    if (this.config.forceAll || this.config.enableError) {
      console.error(...args);
    }
  }

  /**
   * Force enable all logging functions regardless of environment
   */
  enableAll() {
    this.configure({ forceAll: true });
  }

  /**
   * Force disable all logging functions
   */
  disableAll() {
    this.configure({
      enableLog: false,
      enableWarn: false,
      enableError: false,
      forceAll: false,
    });
  }

  /**
   * Get current configuration
   */
  getConfig(): LoggerConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const logger = new Logger();

// Export class for creating custom instances if needed
export { Logger };