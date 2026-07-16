// 发布订阅 · 实现
export interface PubSubHooks {
  onPublish?: (topic: string, msg: unknown) => void;
  onDeliver?: (topic: string, subId: number) => void;
}
export class PubSub {
  private subs = new Map<string, Array<{ id: number; fn: (msg: unknown) => void }>>();
  private nextId = 1;
  constructor(private hooks: PubSubHooks = {}) {}
  subscribe(topic: string, fn: (msg: unknown) => void): number {
    if (!this.subs.has(topic)) this.subs.set(topic, []);
    const id = this.nextId++;
    this.subs.get(topic)!.push({ id, fn });
    return id;
  }
  unsubscribe(topic: string, id: number): void {
    const arr = this.subs.get(topic);
    if (arr)
      this.subs.set(
        topic,
        arr.filter((s) => s.id !== id),
      );
  }
  publish(topic: string, msg: unknown): void {
    this.hooks.onPublish?.(topic, msg);
    const arr = this.subs.get(topic) ?? [];
    for (const s of arr) {
      s.fn(msg);
      this.hooks.onDeliver?.(topic, s.id);
    }
  }
}
