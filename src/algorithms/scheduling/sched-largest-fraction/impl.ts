// 最大份额优先 · 实现

export interface LfTask {
  id: string;
  weight: number;
  demand: number;
}

export interface LfResult {
  order: string[];
  allocation: Record<string, number>;
}

export interface LfHooks {
  onPick?: (id: string, deficit: number) => void;
}

/**
 * 每轮选 deficit = entitled - received 最大的进程。
 */
export function largestFraction(tasks: LfTask[], hooks: LfHooks = {}): LfResult {
  const totalWeight = tasks.reduce((s, t) => s + t.weight, 0);
  const allocation: Record<string, number> = {};
  const order: string[] = [];
  for (const t of tasks) allocation[t.id] = 0;
  const totalDemand = tasks.reduce((s, t) => s + t.demand, 0);

  for (let step = 0; step < totalDemand; step++) {
    let best: string | null = null;
    let bestDef = -Infinity;
    for (const t of tasks) {
      const received = allocation[t.id]!;
      const remaining = t.demand - received;
      if (remaining <= 0) continue;
      const entitled = ((step + 1) * t.weight) / totalWeight;
      const def = entitled - received;
      if (def > bestDef || (def === bestDef && best !== null && t.id < best)) {
        bestDef = def;
        best = t.id;
      }
    }
    if (best === null) break;
    allocation[best] = (allocation[best] ?? 0) + 1;
    order.push(best);
    hooks.onPick?.(best, bestDef);
  }
  return { order, allocation };
}
