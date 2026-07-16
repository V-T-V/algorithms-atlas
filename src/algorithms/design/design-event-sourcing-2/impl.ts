// 事件溯源 v2 · 实现
export interface Event {
  type: string;
  payload: Record<string, unknown>;
  at: number;
}
export type Reducer<S> = (state: S, event: Event) => S;
export interface EsHooks {
  onAppend?: (type: string, total: number) => void;
  onReplay?: (eventCount: number) => void;
}
export class EventStore<S> {
  private events: Event[] = [];
  constructor(
    private initial: S,
    private reducer: Reducer<S>,
    private hooks: EsHooks = {},
  ) {}
  append(type: string, payload: Record<string, unknown> = {}, at = Date.now()): void {
    this.events.push({ type, payload, at });
    this.hooks.onAppend?.(type, this.events.length);
  }
  // 重放全部事件得到当前状态
  currentState(): S {
    this.hooks.onReplay?.(this.events.length);
    return this.events.reduce(this.reducer, this.initial);
  }
  // 重放到某个时间点
  stateAt(timestamp: number): S {
    const upTo = this.events.filter((e) => e.at <= timestamp);
    return upTo.reduce(this.reducer, this.initial);
  }
  eventCount(): number {
    return this.events.length;
  }
}
