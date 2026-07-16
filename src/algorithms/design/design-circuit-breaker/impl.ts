// 熔断器 · 实现
export type CbState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';
export interface CbConfig {
  failureThreshold: number;
  resetTimeoutMs: number;
  halfOpenMax: number;
}
export interface CbHooks {
  onStateChange?: (from: CbState, to: CbState) => void;
  onCall?: (state: CbState, ok: boolean) => void;
}
export class CircuitBreaker {
  state: CbState = 'CLOSED';
  private failures = 0;
  private openedAt = 0;
  private halfOpenCalls = 0;
  constructor(
    private config: CbConfig,
    private now: () => number = Date.now,
    private hooks: CbHooks = {},
  ) {}
  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (this.now() - this.openedAt >= this.config.resetTimeoutMs) {
        this.transition('HALF_OPEN');
        this.halfOpenCalls = 0;
      } else throw new Error('circuit open');
    }
    if (this.state === 'HALF_OPEN' && this.halfOpenCalls >= this.config.halfOpenMax)
      throw new Error('half-open limit');
    if (this.state === 'HALF_OPEN') this.halfOpenCalls++;
    try {
      const r = await fn();
      this.onSuccess();
      this.hooks.onCall?.(this.state, true);
      return r;
    } catch (e) {
      this.onFailure();
      this.hooks.onCall?.(this.state, false);
      throw e;
    }
  }
  private onSuccess(): void {
    if (this.state === 'HALF_OPEN') this.transition('CLOSED');
    this.failures = 0;
  }
  private onFailure(): void {
    this.failures++;
    if (this.state === 'HALF_OPEN') {
      this.transition('OPEN');
      return;
    }
    if (this.failures >= this.config.failureThreshold) this.transition('OPEN');
  }
  private transition(to: CbState): void {
    if (to === this.state) return;
    this.hooks.onStateChange?.(this.state, to);
    this.state = to;
    if (to === 'OPEN') {
      this.openedAt = this.now();
      this.failures = 0;
    }
  }
}
