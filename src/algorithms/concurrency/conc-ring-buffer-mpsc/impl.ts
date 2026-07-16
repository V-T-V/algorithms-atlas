// MPSC 环形缓冲 · 实现
export interface MpEvent {
  thread: number;
  action: 'produce' | 'consume';
  value?: number;
}
export interface MpHooks {
  onProduce?: (t: number, value: number, head: number, tail: number) => void;
  onConsume?: (t: number, value: number, head: number, tail: number) => void;
  onFull?: (t: number) => void;
  onEmpty?: (t: number) => void;
}
export interface MpStep {
  thread: number;
  head: number;
  tail: number;
  buf: (number | null)[];
}
export function simulateMpsc(capacity: number, events: MpEvent[], hooks: MpHooks = {}): MpStep[] {
  const buf: (number | null)[] = new Array(capacity).fill(null);
  let head = 0;
  let tail = 0;
  const steps: MpStep[] = [];
  for (const ev of events) {
    if (ev.action === 'produce') {
      const next = (head + 1) % capacity;
      if (next === tail) hooks.onFull?.(ev.thread);
      else {
        buf[head] = ev.value ?? 0;
        head = next;
        hooks.onProduce?.(ev.thread, ev.value ?? 0, head, tail);
      }
    } else {
      if (tail === head) hooks.onEmpty?.(ev.thread);
      else {
        const v = buf[tail];
        buf[tail] = null;
        tail = (tail + 1) % capacity;
        hooks.onConsume?.(ev.thread, v ?? 0, head, tail);
      }
    }
    steps.push({ thread: ev.thread, head, tail, buf: [...buf] });
  }
  return steps;
}
