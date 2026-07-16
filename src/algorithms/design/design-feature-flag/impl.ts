// 特性开关 · 实现
export interface FeatureFlagHooks {
  onEval?: (key: string, enabled: boolean, reason: string) => void;
}
export class FeatureFlags {
  private flags = new Map<string, boolean | number>();
  constructor(private hooks: FeatureFlagHooks = {}) {}
  setBoolean(key: string, on: boolean): void {
    this.flags.set(key, on);
  }
  setPercent(key: string, percent: number): void {
    this.flags.set(key, percent);
  }
  isEnabled(key: string, userId?: string): boolean {
    const v = this.flags.get(key);
    if (v === undefined) {
      this.hooks.onEval?.(key, false, 'missing');
      return false;
    }
    if (typeof v === 'boolean') {
      this.hooks.onEval?.(key, v, 'boolean');
      return v;
    }
    // 百分比：用 userId hash 取模
    if (userId === undefined) {
      this.hooks.onEval?.(key, false, 'no-user');
      return false;
    }
    const h = hashStr(userId);
    const enabled = h % 100 < v;
    this.hooks.onEval?.(key, enabled, `percent(${v})`);
    return enabled;
  }
}
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}
