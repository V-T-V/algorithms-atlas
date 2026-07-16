export interface MoHooks {
  onWait?: (size: number) => void;
  onSignal?: () => void;
}
export class BoundedMonitor {
  private items: number[] = [];
  constructor(private cap: number) {}
  put(x: number, hooks: MoHooks = {}): void {
    while (this.items.length >= this.cap) hooks.onWait?.(this.items.length);
    this.items.push(x);
    hooks.onSignal?.();
  }
  get(hooks: MoHooks = {}): number {
    while (this.items.length === 0) hooks.onWait?.(0);
    const v = this.items.shift()!;
    hooks.onSignal?.();
    return v;
  }
  size(): number {
    return this.items.length;
  }
}
