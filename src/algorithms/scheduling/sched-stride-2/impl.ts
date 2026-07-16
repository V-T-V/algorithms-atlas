// Stride Scheduling v2 · 纯算法实现
// 步幅调度：pass 值最小的任务获得 CPU，步幅 = strideConst / weight。

export interface StrideTask {
  pid: string;
  burst: number;
  weight: number;
}

export interface StrideHooks {
  onPick?: (pid: string) => void;
}

export function strideSchedule(
  tasks: StrideTask[],
  maxSteps: number,
  strideConst: number = 10000,
  hooks?: StrideHooks,
): {
  completion: Record<string, number>;
  cpuTime: Record<string, number>;
  timeline: Array<{ pid: string; time: number }>;
} {
  const remaining = new Map<string, number>();
  const pass = new Map<string, number>();
  const stride = new Map<string, number>();
  const cpuTime: Record<string, number> = {};
  const completion: Record<string, number> = {};
  const timeline: Array<{ pid: string; time: number }> = [];

  for (const t of tasks) {
    remaining.set(t.pid, t.burst);
    pass.set(t.pid, 0);
    stride.set(t.pid, strideConst / t.weight);
    cpuTime[t.pid] = 0;
  }

  for (let step = 0; step < maxSteps; step++) {
    if ([...remaining.values()].every((r) => r <= 0)) break;

    let best: string | null = null;
    let bestPass = Infinity;

    for (const t of tasks) {
      if ((remaining.get(t.pid) ?? 0) <= 0) continue;
      const p = pass.get(t.pid) ?? 0;
      if (p < bestPass) {
        bestPass = p;
        best = t.pid;
      }
    }

    if (!best) break;

    hooks?.onPick?.(best);
    remaining.set(best, (remaining.get(best) ?? 0) - 1);
    cpuTime[best] = (cpuTime[best] ?? 0) + 1;
    pass.set(best, (pass.get(best) ?? 0) + (stride.get(best) ?? strideConst));
    timeline.push({ pid: best, time: step });

    if ((remaining.get(best) ?? 0) <= 0 && !(best in completion)) {
      completion[best] = step + 1;
    }
  }

  return { completion, cpuTime, timeline };
}
