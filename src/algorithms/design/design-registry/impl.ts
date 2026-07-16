// 注册表 · 实现
export interface RegistryHooks {
  onRegister?: (name: string) => void;
  onLookup?: (name: string, found: boolean) => void;
}
export class Registry<T> {
  private map = new Map<string, T>();
  constructor(private hooks: RegistryHooks = {}) {}
  register(name: string, impl: T): void {
    this.map.set(name, impl);
    this.hooks.onRegister?.(name);
  }
  lookup(name: string): T | undefined {
    const r = this.map.get(name);
    this.hooks.onLookup?.(name, r !== undefined);
    return r;
  }
  has(name: string): boolean {
    return this.map.has(name);
  }
  names(): string[] {
    return [...this.map.keys()];
  }
  clear(): void {
    this.map.clear();
  }
}
