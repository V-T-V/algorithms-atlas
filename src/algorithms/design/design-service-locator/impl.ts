// 服务定位器 · 实现
export interface ServiceFactory<T> {
  (): T;
}
export interface LocatorHooks {
  onRegister?: (key: string) => void;
  onResolve?: (key: string, cached: boolean) => void;
}
export class ServiceLocator {
  private instances = new Map<string, unknown>();
  private factories = new Map<string, ServiceFactory<unknown>>();
  constructor(private hooks: LocatorHooks = {}) {}
  register<T>(key: string, factory: ServiceFactory<T>): void {
    this.factories.set(key, factory as ServiceFactory<unknown>);
    this.hooks.onRegister?.(key);
  }
  resolve<T>(key: string): T {
    if (this.instances.has(key)) {
      this.hooks.onResolve?.(key, true);
      return this.instances.get(key) as T;
    }
    const f = this.factories.get(key);
    if (!f) throw new Error(`service not found: ${key}`);
    const inst = f();
    this.instances.set(key, inst);
    this.hooks.onResolve?.(key, false);
    return inst as T;
  }
}
