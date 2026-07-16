// TestAndSet 互斥锁 · 实现（事件序列模拟）

export type ThreadState = 'idle' | 'waiting' | 'critical';

export interface TasEvent {
  thread: number;
  action: 'lock' | 'unlock';
}

export interface TasStep {
  thread: number;
  action: 'lock' | 'unlock';
  flag: number;
  states: ThreadState[];
  holder: number;
  queue: number[];
}

export interface TasHooks {
  onSpin?: (thread: number, attempts: number) => void;
  onAcquire?: (thread: number) => void;
  onRelease?: (thread: number) => void;
  onBlock?: (thread: number) => void;
}

export function simulateTas(nThreads: number, events: TasEvent[], hooks: TasHooks = {}): TasStep[] {
  let flag = 0;
  let holder = -1;
  const states: ThreadState[] = new Array(nThreads).fill('idle');
  const queue: number[] = [];
  const steps: TasStep[] = [];

  const snap = (thread: number, action: 'lock' | 'unlock'): TasStep => {
    const step: TasStep = { thread, action, flag, states: [...states], holder, queue: [...queue] };
    steps.push(step);
    return step;
  };

  for (const ev of events) {
    if (ev.action === 'lock') {
      // 模拟 TestAndSet：若 flag=0 进入；否则等待
      if (flag === 0) {
        flag = 1;
        states[ev.thread] = 'critical';
        holder = ev.thread;
        hooks.onAcquire?.(ev.thread);
      } else {
        // 忙等几次（模拟），最终进入队列
        let attempts = 0;
        while (flag === 1 && attempts < 2) {
          attempts++;
          hooks.onSpin?.(ev.thread, attempts);
        }
        // 仍占用则入队等待
        states[ev.thread] = 'waiting';
        queue.push(ev.thread);
        hooks.onBlock?.(ev.thread);
      }
      snap(ev.thread, 'lock');
    } else {
      // unlock
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
      snap(ev.thread, 'unlock');
    }
  }
  return steps;
}
