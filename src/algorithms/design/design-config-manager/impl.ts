// 配置管理器 · 实现
export interface ConfigHooks {
  onSet?: (key: string, oldV: unknown, newV: unknown) => void;
}
export class ConfigManager {
  private config: Record<string, unknown> = {};
  private listeners = new Map<string, Array<(value: unknown) => void>>();
  constructor(
    private defaults: Record<string, unknown> = {},
    private hooks: ConfigHooks = {},
  ) {
    this.config = { ...defaults };
  }
  get<T>(key: string, fallback?: T): T {
    return (this.config[key] ?? fallback) as T;
  }
  set(key: string, value: unknown): void {
    const oldV = this.config[key];
    this.config[key] = value;
    this.hooks.onSet?.(key, oldV, value);
    const arr = this.listeners.get(key);
    if (arr) for (const fn of arr) fn(value);
  }
  onChange(key: string, fn: (value: unknown) => void): void {
    if (!this.listeners.has(key)) this.listeners.set(key, []);
    this.listeners.get(key)!.push(fn);
  }
}
