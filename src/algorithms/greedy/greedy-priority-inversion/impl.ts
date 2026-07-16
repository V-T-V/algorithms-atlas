// 优先级继承 · 实现
export interface PiHooks {
  onBoost?: (task: number, fromPrio: number, toPrio: number) => void;
  onRelease?: (task: number) => void;
}
export interface Task {
  id: number;
  prio: number;
  holds?: number;
  waits?: number;
}
export function priorityInheritance(tasks: readonly Task[], hooks: PiHooks = {}): void {
  const holder = new Map<number, number>(); // resource -> taskId
  for (const t of tasks) if (t.holds !== undefined) holder.set(t.holds, t.id);
  for (const t of tasks) {
    if (t.waits === undefined) continue;
    const h = holder.get(t.waits);
    if (h === undefined) continue;
    const holderTask = tasks.find((x) => x.id === h);
    if (holderTask && holderTask.prio < t.prio) {
      hooks.onBoost?.(holderTask.id, holderTask.prio, t.prio);
      holderTask.prio = t.prio;
    }
  }
}
