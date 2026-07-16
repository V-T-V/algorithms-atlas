// 事件总线 · 实现
export interface EventBusHooks {
  onEmit?: (event: string, count: number) => void;
}
export class EventBus {
  private listeners = new Map<string, Array<(payload: unknown) => void>>();
  constructor(private hooks: EventBusHooks = {}) {}
  on(event: string, fn: (payload: unknown) => void): void {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(fn);
  }
  off(event: string, fn: (payload: unknown) => void): void {
    const arr = this.listeners.get(event);
    if (arr)
      this.listeners.set(
        event,
        arr.filter((f) => f !== fn),
      );
  }
  emit(event: string, payload: unknown): void {
    const arr = this.listeners.get(event) ?? [];
    for (const f of arr) f(payload);
    this.hooks.onEmit?.(event, arr.length);
  }
}
