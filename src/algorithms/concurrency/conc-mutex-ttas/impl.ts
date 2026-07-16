// Test-Test-And-Set 锁 · 实现

export type ThreadState = 'idle' | 'reading' | 'critical' | 'waiting';

export interface TtasEvent {
  thread: number;
  action: 'lock' | 'unlock';
}

export interface TtasStep {
  thread: number;
  action: string;
  flag: number;
  states: ThreadState[];
  holder: number;
  queue: number[];
  reads: number[];
}

export interface TtasHooks {
  onReadSpin?: (thread: number) => void;
  onAcquire?: (thread: number) => void;
  onRelease?: (thread: number) => void;
}

export function simulateTtas(
  nThreads: number,
  events: TtasEvent[],
  hooks: TtasHooks = {},
): TtasStep[] {
  let flag = 0;
  let holder = -1;
  const states: ThreadState[] = new Array(nThreads).fill('idle');
  const queue: number[] = [];
  const reads = new Array(nThreads).fill(0);
  const steps: TtasStep[] = [];

  for (const ev of events) {
    if (ev.action === 'lock') {
      if (flag === 0) {
        states[ev.thread] = 'critical';
        flag = 1;
        holder = ev.thread;
        hooks.onAcquire?.(ev.thread);
      } else {
        // 读自旋几次模拟
        for (let r = 0; r < 3 && flag === 1; r++) {
          reads[ev.thread]!++;
          states[ev.thread] = 'reading';
          hooks.onReadSpin?.(ev.thread);
        }
        if (flag === 1) {
          states[ev.thread] = 'waiting';
          queue.push(ev.thread);
        }
      }
    } else {
      flag = 0;
      states[ev.thread] = 'idle';
      if (holder === ev.thread) holder = -1;
      hooks.onRelease?.(ev.thread);
      if (queue.length > 0) {
        const next = queue.shift()!;
        states[next] = 'critical';
        holder = next;
        flag = 1;
        hooks.onAcquire?.(next);
      }
    }
    steps.push({
      thread: ev.thread,
      action: ev.action,
      flag,
      states: [...states],
      holder,
      queue: [...queue],
      reads: [...reads],
    });
  }
  return steps;
}
