export interface Job {
  id: string;
  arrival: number;
  burst: number;
  priority?: number;
}
export interface Segment {
  id: string;
  start: number;
  end: number;
}
export interface SchedResult {
  order: string[];
  segments: Segment[];
  avgWait: number;
  avgTurnaround: number;
}
export interface PiJob extends Job {
  holding: string[];
}
export interface PiHooks {
  onInherit?: (id: string, newPri: number) => void;
  onResult?: (p: Map<string, number>) => void;
}
export function priorityInheritance(
  jobs: PiJob[],
  blockedOn: Map<string, string>,
  hooks: PiHooks = {},
): Map<string, number> {
  const eff = new Map(jobs.map((j) => [j.id, j.priority ?? 0]));
  for (const [waiter, res] of blockedOn) {
    const holder = jobs.find((j) => j.holding.includes(res));
    if (holder) {
      const newPri = Math.min(eff.get(holder.id)!, eff.get(waiter) ?? 0);
      if (newPri < eff.get(holder.id)!) {
        eff.set(holder.id, newPri);
        hooks.onInherit?.(holder.id, newPri);
      }
    }
  }
  hooks.onResult?.(eff);
  return eff;
}
