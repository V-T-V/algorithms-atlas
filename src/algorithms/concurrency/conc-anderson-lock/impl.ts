// Anderson 锁 · 实现
export interface AnEvent {
  thread: number;
  action: 'lock' | 'unlock';
}
export interface AnHooks {
  onAcquire?: (t: number, slot: number) => void;
  onRelease?: (t: number, nextSlot: number) => void;
  onWait?: (t: number, slot: number) => void;
}
export interface AnStep {
  thread: number;
  tail: number;
  slots: boolean[];
  holder: number;
}
export function simulateAnderson(n: number, events: AnEvent[], hooks: AnHooks = {}): AnStep[] {
  const slots: boolean[] = new Array(n).fill(false);
  slots[0] = true;
  let tail = 0;
  let holder = -1;
  const waitSlot = new Map<number, number>();
  const steps: AnStep[] = [];
  for (const ev of events) {
    if (ev.action === 'lock') {
      const mySlot = tail;
      tail = (tail + 1) % n;
      waitSlot.set(ev.thread, mySlot);
      if (slots[mySlot]) {
        slots[mySlot] = false;
        holder = ev.thread;
        hooks.onAcquire?.(ev.thread, mySlot);
      } else {
        hooks.onWait?.(ev.thread, mySlot);
        // 模拟：等到下一轮也视为获得
        slots[mySlot] = false;
        holder = ev.thread;
        hooks.onAcquire?.(ev.thread, mySlot);
      }
    } else if (holder === ev.thread) {
      const next = waitSlot.size % n;
      slots[tail % n] = true;
      holder = -1;
      hooks.onRelease?.(ev.thread, next);
    }
    steps.push({ thread: ev.thread, tail, slots: [...slots], holder });
  }
  return steps;
}
