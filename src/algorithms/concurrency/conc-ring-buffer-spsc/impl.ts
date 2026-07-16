// SPSC 环形缓冲 · 实现
export interface SpEvent {
  action: 'produce' | 'consume';
  value?: number;
}
export interface SpHooks {
  onProduce?: (value: number, head: number, tail: number) => void;
  onConsume?: (value: number, head: number, tail: number) => void;
}
export interface SpStep {
  head: number;
  tail: number;
  buf: (number | null)[];
}
export function simulateSpsc(capacity: number, events: SpEvent[], hooks: SpHooks = {}): SpStep[] {
  const buf: (number | null)[] = new Array(capacity).fill(null);
  let head = 0;
  let tail = 0;
  const steps: SpStep[] = [];
  for (const ev of events) {
    if (ev.action === 'produce') {
      const next = (head + 1) % capacity;
      if (next === tail) {
        /* full, drop */
      } else {
        buf[head] = ev.value ?? 0;
        head = next;
        hooks.onProduce?.(ev.value ?? 0, head, tail);
      }
    } else {
      if (tail === head) {
        /* empty */
      } else {
        const v = buf[tail];
        buf[tail] = null;
        tail = (tail + 1) % capacity;
        hooks.onConsume?.(v ?? 0, head, tail);
      }
    }
    steps.push({ head, tail, buf: [...buf] });
  }
  return steps;
}
