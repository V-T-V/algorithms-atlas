export type Event = { type: string; payload: number };
export type Listener = (e: Event) => void;
export class EventBus {
  private listeners = new Map<string, Listener[]>();
  subscribe(type: string, l: Listener): void {
    (this.listeners.get(type) ?? this.listeners.set(type, []).get(type)!).push(l);
  }
  emit(e: Event, hooks: { onEmit?: (type: string, count: number) => void } = {}): void {
    const ls = this.listeners.get(e.type) ?? [];
    hooks.onEmit?.(e.type, ls.length);
    ls.forEach((l) => l(e));
  }
}
