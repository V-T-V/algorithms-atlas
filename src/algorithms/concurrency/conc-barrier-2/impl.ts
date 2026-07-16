// 屏障 v2 · 实现
export interface B2Event {
  thread: number;
  action: 'arrive';
}
export interface B2Hooks {
  onArrive?: (t: number, arrived: number, total: number) => void;
  onRelease?: (generation: number) => void;
}
export interface B2Step {
  thread: number;
  arrived: number;
  generation: number;
}
export function simulateBarrier2(
  parties: number,
  events: B2Event[],
  hooks: B2Hooks = {},
): B2Step[] {
  let arrived = 0;
  let generation = 0;
  const steps: B2Step[] = [];
  for (const ev of events) {
    arrived++;
    hooks.onArrive?.(ev.thread, arrived, parties);
    if (arrived >= parties) {
      hooks.onRelease?.(generation);
      arrived = 0;
      generation++;
    }
    steps.push({ thread: ev.thread, arrived, generation });
  }
  return steps;
}
