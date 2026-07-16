// 消息队列 · 实现
export interface MqHooks {
  onEnqueue?: (msg: unknown, size: number) => void;
  onDequeue?: (msg: unknown, size: number) => void;
}
export class MessageQueue<T> {
  private items: T[] = [];
  constructor(private hooks: MqHooks = {}) {}
  enqueue(msg: T): void {
    this.items.push(msg);
    this.hooks.onEnqueue?.(msg, this.items.length);
  }
  dequeue(): T | undefined {
    if (this.items.length === 0) return undefined;
    const m = this.items.shift()!;
    this.hooks.onDequeue?.(m, this.items.length);
    return m;
  }
  get size(): number {
    return this.items.length;
  }
}
