// 限流器 · 实现（令牌桶）
export interface RateLimiterHooks {
  onAllow?: (tokens: number) => void;
  onReject?: (tokens: number) => void;
  onRefill?: (tokens: number) => void;
}
export class TokenBucket {
  private tokens: number;
  private lastRefill: number;
  constructor(
    private capacity: number,
    private ratePerSec: number,
    private now: () => number = Date.now,
    private hooks: RateLimiterHooks = {},
  ) {
    this.tokens = capacity;
    this.lastRefill = now();
  }
  private refill(): void {
    const t = this.now();
    const delta = ((t - this.lastRefill) / 1000) * this.ratePerSec;
    if (delta > 0) {
      this.tokens = Math.min(this.capacity, this.tokens + delta);
      this.lastRefill = t;
      this.hooks.onRefill?.(this.tokens);
    }
  }
  tryAcquire(n = 1): boolean {
    this.refill();
    if (this.tokens >= n) {
      this.tokens -= n;
      this.hooks.onAllow?.(this.tokens);
      return true;
    }
    this.hooks.onReject?.(this.tokens);
    return false;
  }
}
