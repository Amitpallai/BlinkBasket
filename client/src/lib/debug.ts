export const debugLog = (
  scope: string,
  message: string,
  meta?: Record<string, unknown>
) => {
  // Centralized debug hook for easier troubleshooting in dev.
  console.debug(`[${scope}] ${message}`, meta ?? {});
};

export const debugError = (
  scope: string,
  error: unknown,
  meta?: Record<string, unknown>
) => {
  console.error(`[${scope}]`, error, meta ?? {});
};
