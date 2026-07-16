export interface DmJob {
  id: string;
  period: number;
  burst: number;
  deadline: number;
}
export interface DmHooks {
  onAssign?: (id: string, pri: number) => void;
  onResult?: (out: Array<{ id: string; priority: number }>) => void;
}
export function deadlineMonotonic(
  jobs: DmJob[],
  hooks: DmHooks = {},
): Array<{ id: string; priority: number }> {
  const sorted = [...jobs].sort((a, b) => a.deadline - b.deadline);
  const out = sorted.map((j, i) => ({ id: j.id, priority: i }));
  for (const o of out) hooks.onAssign?.(o.id, o.priority);
  hooks.onResult?.(out);
  return out;
}
