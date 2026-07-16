// 保证调度（Guaranteed Scheduling）· 纯算法实现

export interface GsProcess {
  id: string;
  burst: number;
}

export interface GsSegment {
  id: string;
  start: number;
  finish: number;
}

export interface GsStat {
  id: string;
  burst: number;
  completion: number;
  allocated: number;
  wait: number;
}

export interface GsResult {
  segments: GsSegment[];
  stats: GsStat[];
  avgWait: number;
  avgTurnaround: number;
}

/** 事件钩子。 */
export interface GsHooks {
  /** 选择某进程运行一个时间单位（给出其 used/entitled 比）。 */
  onPick?: (proc: GsProcess, ratio: number, activeCount: number, time: number) => void;
  /** 某进程完成。 */
  onComplete?: (stat: GsStat) => void;
}

/**
 * 保证调度：每进程至少 1/n CPU。
 *
 * @param processes 进程列表
 * @param hooks 可选事件钩子
 */
export function guaranteedScheduling(
  processes: readonly GsProcess[],
  hooks: GsHooks = {},
): GsResult {
  const n = processes.length;
  if (n === 0) return { segments: [], stats: [], avgWait: 0, avgTurnaround: 0 };

  const remaining = new Map<string, number>();
  const allocated = new Map<string, number>();
  for (const p of processes) {
    remaining.set(p.id, p.burst);
    allocated.set(p.id, 0);
  }
  const done = new Set<string>();
  const completion = new Map<string, number>();
  const segments: GsSegment[] = [];
  let time = 0;
  const totalBurst = processes.reduce((s, p) => s + p.burst, 0);

  for (let step = 0; step < totalBurst; step++) {
    const active = processes.filter((p) => !done.has(p.id));
    if (active.length === 0) break;
    const activeN = active.length;
    const entitled = 1 / activeN;

    let best: GsProcess | null = null;
    let bestRatio = Infinity;
    for (const p of active) {
      const alloc = allocated.get(p.id) ?? 0;
      const actualRate = alloc / (time + 1); // 占时间维度上的实际率
      const ratio = actualRate / entitled;
      if (ratio < bestRatio) {
        bestRatio = ratio;
        best = p;
      }
    }
    if (!best) break;
    const p = best;
    hooks.onPick?.(p, bestRatio, activeN, time);

    const last = segments[segments.length - 1];
    if (last && last.id === p.id && last.finish === time) {
      last.finish = time + 1;
    } else {
      segments.push({ id: p.id, start: time, finish: time + 1 });
    }
    allocated.set(p.id, (allocated.get(p.id) ?? 0) + 1);
    remaining.set(p.id, (remaining.get(p.id) ?? 0) - 1);
    time++;
    if ((remaining.get(p.id) ?? 0) <= 0) {
      done.add(p.id);
      completion.set(p.id, time);
    }
  }

  const stats: GsStat[] = processes.map((p) => {
    const comp = completion.get(p.id) ?? 0;
    const alloc = allocated.get(p.id) ?? 0;
    const stat: GsStat = {
      id: p.id,
      burst: p.burst,
      completion: comp,
      allocated: alloc,
      wait: comp - p.burst,
    };
    return stat;
  });
  // 触发 onComplete（按完成顺序）
  for (const s of [...stats].sort((a, b) => a.completion - b.completion)) {
    hooks.onComplete?.(s);
  }
  const avgWait = stats.reduce((s, x) => s + x.wait, 0) / n;
  const avgTurn = stats.reduce((s, x) => s + x.completion, 0) / n;
  return { segments, stats, avgWait, avgTurnaround: avgTurn };
}
