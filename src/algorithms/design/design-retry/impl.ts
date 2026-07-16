// 重试 · 实现（指数退避）
export interface RetryConfig {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  jitter: number;
}
export interface RetryHooks {
  onAttempt?: (attempt: number) => void;
  onFail?: (attempt: number, err: unknown) => void;
  onBackoff?: (attempt: number, delayMs: number) => void;
  onSuccess?: (attempt: number) => void;
}
export async function retry<T>(
  fn: () => Promise<T>,
  config: RetryConfig,
  hooks: RetryHooks = {},
  sleep: (ms: number) => Promise<void> = defaultSleep,
): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    hooks.onAttempt?.(attempt);
    try {
      const r = await fn();
      hooks.onSuccess?.(attempt);
      return r;
    } catch (e) {
      lastErr = e;
      hooks.onFail?.(attempt, e);
      if (attempt >= config.maxAttempts) break;
      const exp = Math.min(config.maxDelayMs, config.baseDelayMs * Math.pow(2, attempt - 1));
      const jitter = config.jitter * Math.random() * exp;
      const delay = Math.floor(exp + jitter);
      hooks.onBackoff?.(attempt, delay);
      await sleep(delay);
    }
  }
  throw lastErr;
}
const defaultSleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));
