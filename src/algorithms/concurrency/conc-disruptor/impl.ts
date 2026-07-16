// Disruptor · 实现（简化）
export interface DisEvent {
  thread: number;
  action: 'publish';
  value?: number;
}
export interface DisHooks {
  onPublish?: (t: number, value: number, seq: number) => void;
  onConsume?: (consumer: number, value: number, seq: number) => void;
}
export interface DisStep {
  thread: number;
  cursor: number;
  buf: (number | null)[];
  consumerSeqs: number[];
}
export function simulateDisruptor(
  capacity: number,
  nConsumers: number,
  events: DisEvent[],
  hooks: DisHooks = {},
): DisStep[] {
  const buf: (number | null)[] = new Array(capacity).fill(null);
  let cursor = -1;
  const consumerSeqs: number[] = new Array(nConsumers).fill(-1);
  const steps: DisStep[] = [];
  for (const ev of events) {
    if (ev.action === 'publish') {
      cursor++;
      const idx = cursor % capacity;
      buf[idx] = ev.value ?? 0;
      hooks.onPublish?.(ev.thread, ev.value ?? 0, cursor);
      // 消费者各自追赶
      for (let c = 0; c < nConsumers; c++) {
        consumerSeqs[c] = cursor;
        hooks.onConsume?.(c, ev.value ?? 0, cursor);
      }
    }
    steps.push({ thread: ev.thread, cursor, buf: [...buf], consumerSeqs: [...consumerSeqs] });
  }
  return steps;
}
