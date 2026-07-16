export interface TssHooks {
  onAccess?: (thread: number, val: number) => void;
}
export class TssCounter {
  private map = new Map<number, number>();
  inc(thread: number, hooks: TssHooks = {}): number {
    const v = (this.map.get(thread) ?? 0) + 1;
    this.map.set(thread, v);
    hooks.onAccess?.(thread, v);
    return v;
  }
  get(thread: number): number {
    return this.map.get(thread) ?? 0;
  }
}
