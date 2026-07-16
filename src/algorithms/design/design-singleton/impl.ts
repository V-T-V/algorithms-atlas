// 单例模式 · 实现
export interface SingletonHooks {
  onCreate?: (accessCount: number) => void;
  onAccess?: (accessCount: number, key: string, value: string) => void;
}

export class ConfigSingleton {
  private static instance: ConfigSingleton | null = null;
  private static hooks: SingletonHooks = {};
  private accessCount = 0;
  private settings: Record<string, string> = {};

  private constructor() {}

  static setHooks(h: SingletonHooks): void {
    this.hooks = h;
  }

  static getInstance(): ConfigSingleton {
    if (ConfigSingleton.instance === null) {
      ConfigSingleton.instance = new ConfigSingleton();
      ConfigSingleton.hooks.onCreate?.(0);
    }
    return ConfigSingleton.instance;
  }

  static reset(): void {
    ConfigSingleton.instance = null;
    ConfigSingleton.hooks = {};
  }

  get(key: string): string | undefined {
    this.accessCount++;
    const v = this.settings[key];
    ConfigSingleton.hooks.onAccess?.(this.accessCount, key, v ?? 'undefined');
    return v;
  }
  set(key: string, value: string): void {
    this.settings[key] = value;
  }
  getAccessCount(): number {
    return this.accessCount;
  }
  keys(): string[] {
    return Object.keys(this.settings);
  }
}
