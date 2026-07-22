/** Extracts a backend-provided error message from an HttpErrorResponse (Nest's {statusCode,message,error} body). */
export function extractErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Object && 'error' in err) {
    const body = (err as { error?: { message?: unknown } }).error;
    const msg = body?.message;
    if (typeof msg === 'string') return msg;
    if (Array.isArray(msg)) return msg.join(', ');
    if (msg && typeof msg === 'object' && 'message' in msg) {
      const inner = (msg as { message: unknown }).message;
      if (typeof inner === 'string') return inner;
      if (Array.isArray(inner)) return inner.join(', ');
    }
  }
  return fallback;
}
