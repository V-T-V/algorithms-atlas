// 有界缓冲锁版 · 实现

export interface BbEvent {
  who: 'P' | 'C';
}

export interface BbStep {
  who: string;
  buffer: number[];
  empty: number;
  full: number;
}

export function simulateBoundedBuffer(events: BbEvent[], capacity = 3): BbStep[] {
  const buffer: number[] = [];
  let empty = capacity;
  let full = 0;
  let id = 0;
  const steps: BbStep[] = [];
  for (const ev of events) {
    if (ev.who === 'P') {
      // P(empty) P(mutex) put V(mutex) V(full)
      if (empty > 0) {
        empty--;
        buffer.push(id++);
        full++;
      }
    } else {
      if (full > 0) {
        full--;
        buffer.shift();
        empty++;
      }
    }
    steps.push({ who: ev.who, buffer: [...buffer], empty, full });
  }
  return steps;
}
