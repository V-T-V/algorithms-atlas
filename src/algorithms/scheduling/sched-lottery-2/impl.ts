// Lottery Scheduling v2 · 纯算法实现
// 彩票调度：按 tickets 比例随机选中任务运行 1 单位，直到全部完成。

export function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1103515245 + 12345) >>> 0;
    return s / 4294967296;
  };
}

export interface LotteryTask {
  pid: string;
  burst: number;
  tickets: number;
}

export function lotterySchedule(
  tasks: LotteryTask[],
  steps: number,
  rng: () => number,
): {
  completion: Record<string, number>;
  cpuTime: Record<string, number>;
  timeline: Array<{ pid: string; time: number }>;
} {
  const remaining = new Map<string, number>();
  const cpuTime: Record<string, number> = {};
  const completion: Record<string, number> = {};
  const timeline: Array<{ pid: string; time: number }> = [];

  for (const t of tasks) {
    remaining.set(t.pid, t.burst);
    cpuTime[t.pid] = 0;
  }

  const totalTickets = tasks.reduce((s, t) => s + t.tickets, 0);

  for (let step = 0; step < steps; step++) {
    if ([...remaining.values()].every((r) => r <= 0)) break;

    const win = rng() * totalTickets;
    let acc = 0;
    let winner: LotteryTask | null = null;

    for (const t of tasks) {
      acc += t.tickets;
      if (win < acc && (remaining.get(t.pid) ?? 0) > 0) {
        winner = t;
        break;
      }
    }

    if (!winner) {
      for (const t of tasks) {
        if ((remaining.get(t.pid) ?? 0) > 0) {
          winner = t;
          break;
        }
      }
    }

    if (!winner) continue;

    remaining.set(winner.pid, (remaining.get(winner.pid) ?? 0) - 1);
    cpuTime[winner.pid] = (cpuTime[winner.pid] ?? 0) + 1;
    timeline.push({ pid: winner.pid, time: step });

    if ((remaining.get(winner.pid) ?? 0) <= 0 && !(winner.pid in completion)) {
      completion[winner.pid] = step + 1;
    }
  }

  return { completion, cpuTime, timeline };
}
