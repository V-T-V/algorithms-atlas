// 步幅调度 · 实现

export interface StrideTask {
  id: string;
  weight: number; // > 0
  tickets: number; // 总需求步数
}

export interface StrideStep {
  id: string;
  passBefore: number;
  passAfter: number;
}

export interface StrideResult {
  /** 调度顺序。 */
  order: string[];
  steps: StrideStep[];
  /** 每进程实际分得的步数。 */
  allocation: Record<string, number>;
}

export interface StrideHooks {
  onPick?: (id: string, pass: number) => void;
}

/**
 * 步幅调度：stride = L/weight，每轮选 pass 最小者。
 * L 取所有权重乘积附近的大常数保证精度，这里用 10000。
 */
export function strideScheduling(
  tasks: readonly StrideTask[],
  hooks: StrideHooks = {},
): StrideResult {
  const L = 10000;
  const pass = new Map<string, number>();
  const stride = new Map<string, number>();
  const allocation: Record<string, number> = {};
  for (const t of tasks) {
    pass.set(t.id, 0);
    stride.set(t.id, L / t.weight);
    allocation[t.id] = 0;
  }
  const order: string[] = [];
  const steps: StrideStep[] = [];
  const remaining = new Map<string, number>();
  for (const t of tasks) remaining.set(t.id, t.tickets);

  const totalTickets = tasks.reduce((s, t) => s + t.tickets, 0);
  for (let round = 0; round < totalTickets; round++) {
    // 选 pass 最小（平手取 id 字典序最小）
    let best: string | null = null;
    for (const t of tasks) {
      const id = t.id;
      if (remaining.get(id)! <= 0) continue;
      if (
        best === null ||
        pass.get(id)! < pass.get(best)! ||
        (pass.get(id)! === pass.get(best)! && id < best)
      ) {
        best = id;
      }
    }
    if (best === null) break;
    const id = best;
    const before = pass.get(id)!;
    const st: number = stride.get(id)!;
    pass.set(id, before + st);
    allocation[id] = (allocation[id] ?? 0) + 1;
    remaining.set(id, remaining.get(id)! - 1);
    order.push(id);
    steps.push({ id, passBefore: before, passAfter: before + st });
    hooks.onPick?.(id, before);
  }
  return { order, steps, allocation };
}
