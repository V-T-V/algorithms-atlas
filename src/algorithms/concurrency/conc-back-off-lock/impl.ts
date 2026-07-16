// 退避自旋锁 · 实现
export interface BoEvent {
  thread: number;
  action: 'lock' | 'unlock';
}
export interface BoHooks {
  onBackoff?: (t: number, delay: number, attempt: number) => void;
  onAcquire?: (t: number) => void;
  onRelease?: (t: number) => void;
}
export interface BoStep {
  thread: number;
  flag: number;
  holder: number;
  backoffs: number[];
}
export function simulateBackoff(
  n: number,
  events: BoEvent[],
  seed = 7,
  hooks: BoHooks = {},
): BoStep[] {
  let s = seed >>> 0;
  const rng = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  let flag = 0;
  let holder = -1;
  const backoffs: number[] = new Array(n).fill(0);
  const steps: BoStep[] = [];
  for (const ev of events) {
    if (ev.action === 'lock') {
      let attempt = 0;
      while (flag === 1 && attempt < 5) {
        const delay = Math.min(1 << attempt, 16) * (0.5 + rng() * 0.5);
        attempt++;
        backoffs[ev.thread] = (backoffs[ev.thread] ?? 0) + Math.round(delay);
        hooks.onBackoff?.(ev.thread, delay, attempt);
      }
      if (flag === 0) {
        flag = 1;
        holder = ev.thread;
        hooks.onAcquire?.(ev.thread);
      }
    } else if (holder === ev.thread) {
      flag = 0;
      holder = -1;
      hooks.onRelease?.(ev.thread);
    }
    steps.push({ thread: ev.thread, flag, holder, backoffs: [...backoffs] });
  }
  return steps;
}
