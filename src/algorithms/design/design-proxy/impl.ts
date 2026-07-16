// 代理模式 · 实现
export interface ProxyHooks {
  onLoad?: (key: string, fromCache: boolean) => void;
  onAccess?: (key: string, cached: boolean) => void;
}

export interface Image {
  key: string;
  render(): string;
}

export class RealImage implements Image {
  public loaded = false;
  constructor(
    public readonly key: string,
    private readonly cost: number,
    private readonly hooks: ProxyHooks = {},
  ) {}
  load(): void {
    this.loaded = true;
    this.hooks.onLoad?.(this.key, false);
  }
  render(): string {
    if (!this.loaded) this.load();
    return `render(${this.key}, cost=${this.cost})`;
  }
}

export class ImageProxy implements Image {
  private real: RealImage | null = null;
  private cachedRender: string | null = null;
  constructor(
    public readonly key: string,
    private readonly cost: number,
    private readonly hooks: ProxyHooks = {},
  ) {}
  render(): string {
    if (this.cachedRender !== null) {
      this.hooks.onAccess?.(this.key, true);
      return this.cachedRender;
    }
    if (this.real === null) this.real = new RealImage(this.key, this.cost, this.hooks);
    this.cachedRender = this.real.render();
    this.hooks.onAccess?.(this.key, false);
    return this.cachedRender;
  }
  isLoaded(): boolean {
    return this.real !== null && this.real.loaded;
  }
}
