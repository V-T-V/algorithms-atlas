export interface PoolHooks {
  onRun?: (i: number, active: number) => void;
  onQueue?: (i: number) => void;
  onDone?: (i: number) => void;
}
export function asyncTaskPool(
  tasks: number[],
  maxConcurrent: number,
  hooks: PoolHooks = {},
): number[] {
  const done: number[] = [];
  let active = 0;
  const queue: number[] = [];
  const order: number[] = [];
  for (let i = 0; i < tasks.length; i++) {
    if (active < maxConcurrent) {
      active++;
      order.push(i);
      hooks.onRun?.(i, active);
    } else {
      queue.push(i);
      hooks.onQueue?.(i);
    }
  }
  while (queue.length) {
    const t = queue.shift()!;
    hooks.onDone?.(t);
    done.push(t);
  }
  return order;
}
