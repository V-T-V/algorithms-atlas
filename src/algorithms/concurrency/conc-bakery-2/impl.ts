// Bakery 算法 v2 · 实现
export interface BkEvent {
  thread: number;
  action: 'enter' | 'exit';
}
export interface BkHooks {
  onTicket?: (t: number, ticket: number) => void;
  onAcquire?: (t: number) => void;
  onRelease?: (t: number) => void;
}
export interface BkStep {
  thread: number;
  tickets: number[];
  inCs: boolean[];
}
export function simulateBakery(n: number, events: BkEvent[], hooks: BkHooks = {}): BkStep[] {
  const tickets: number[] = new Array(n).fill(0);
  const inCs: boolean[] = new Array(n).fill(false);
  const steps: BkStep[] = [];
  for (const ev of events) {
    if (ev.action === 'enter') {
      // choosing 阶段（取号原子性）
      let max = 0;
      for (const tk of tickets) if (tk > max) max = tk;
      tickets[ev.thread] = max + 1;
      hooks.onTicket?.(ev.thread, tickets[ev.thread]!);
      // 是否我的号最小？
      let canEnter = true;
      for (let j = 0; j < n; j++) {
        if (j === ev.thread) continue;
        if (tickets[j]! !== 0) {
          if (
            tickets[j]! < tickets[ev.thread]! ||
            (tickets[j]! === tickets[ev.thread]! && j < ev.thread)
          ) {
            canEnter = false;
            break;
          }
        }
      }
      if (canEnter) {
        inCs[ev.thread] = true;
        hooks.onAcquire?.(ev.thread);
      }
    } else {
      if (inCs[ev.thread]) {
        inCs[ev.thread] = false;
        tickets[ev.thread] = 0;
        hooks.onRelease?.(ev.thread);
      }
    }
    steps.push({ thread: ev.thread, tickets: [...tickets], inCs: [...inCs] });
  }
  return steps;
}
