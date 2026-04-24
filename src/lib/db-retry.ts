
/**
 * Utility for retrying database operations with exponential backoff.
 * Especially useful in silverless/worker environments where connections can be transient.
 */
export async function withDbRetry<T>(
  operation: () => Promise<T>,
  retries = 5,
  delay = 500
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Determine if the error is transient and worth retrying
      const isTransient = 
        error.message?.includes('connection') || 
        error.message?.includes('timeout') || 
        error.message?.includes('EADDRINUSE') ||
        error.message?.includes('terminat') ||
        error.message?.includes('Pool') ||
        error.code === 'EADDRINUSE' ||
        error.code === 'P1001' || // Can't reach database
        error.code === 'P1002' || // Time out
        error.code === 'P1008' || // Operations time out
        error.code === 'P2024'; // Connection timeout

      if (!isTransient) {
        throw error;
      }

      console.warn(`[DB Retry] Attempt ${i + 1}/${retries} failed: ${error.message}`);
      
      if (i < retries - 1) {
        const backoff = delay * Math.pow(2, i);
        // Force a slightly longer pause for EADDRINUSE to allow OS to reclaim ports
        const wait = error.message?.includes('EADDRINUSE') ? backoff + 500 : backoff;
        await new Promise(resolve => setTimeout(resolve, wait));
      }
    }
  }
  
  throw lastError;
}
