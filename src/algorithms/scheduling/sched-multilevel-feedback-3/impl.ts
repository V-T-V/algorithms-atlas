// 多级反馈队列 (MLFQ) · 纯算法实现
export interface MLFQHooks {
  onDispatch?: (pid: string, level: number, run: number, time: number) => void;
  onDemote?: (pid: string, fromLevel: number, toLevel: number) => void;
  onComplete?: (pid: string, completionTime: number) => void;
  onResult?: (avgWait: number) => void;
}

export interface MLFQProcess {
  pid: string;
  arrival: number;
  burst: number;
  /** 每次 dispatch 的 yieldAt：模拟进程主动让出的剩余 burst 阈值（用于 IO 模拟）。
   *  简化版：进程在 burst 减到 ioPoints 之一时让出。 */
  ioPoints?: number[];
}

export function mlfq(
  procs: readonly MLFQProcess[],
  levels = 3,
  quanta: number[] = [2, 4, 8],
  hooks: MLFQHooks = {},
): {
  completion: Record<string, number>;
  waiting: Record<string, number>;
  timeline: Array<{ pid: string; start: number; end: number; level: number }>;
} {
  const remaining: Record<string, number> = {};
  const curLevel: Record<string, number> = {};
  const ioSets: Record<string, Set<number>> = {};
  procs.forEach((p) => {
    remaining[p.pid] = p.burst;
    curLevel[p.pid] = 0;
    ioSets[p.pid] = new Set((p.ioPoints ?? []).map((x) => p.burst - x));
  });
  const queues: MLFQProcess[][] = Array.from({ length: levels }, () => []);
  const inQueue = new Set<string>();
  const completion: Record<string, number> = {};
  const timeline: Array<{ pid: string; start: number; end: number; level: number }> = [];
  let time = 0;
  let done = 0;
  const n = procs.length;
  const arrived = [...procs].sort((a, b) => a.arrival - b.arrival);
  let idx = 0;

  const pushQueue = (p: MLFQProcess, level: number) => {
    queues[level]!.push(p);
    inQueue.add(p.pid);
  };

  while (done < n) {
    // 入队新到达
    while (idx < arrived.length && arrived[idx]!.arrival <= time) {
      pushQueue(arrived[idx]!, 0);
      idx++;
    }
    // 找最高非空队列
    let lvl = -1;
    for (let i = 0; i < levels; i++) {
      if (queues[i]!.length > 0) {
        lvl = i;
        break;
      }
    }
    if (lvl === -1) {
      time++;
      continue;
    }
    const cur = queues[lvl]!.shift()!;
    inQueue.delete(cur.pid);
    const q = quanta[lvl]!;
    const startRem = remaining[cur.pid]!;
    const beforeBurst = cur.burst - startRem; // 已运行量
    // 是否会在 quantum 内触发 IO 让出
    let willYield = false;
    let run = Math.min(q, startRem);
    for (let k = 1; k <= run; k++) {
      if (ioSets[cur.pid]!.has(beforeBurst + k)) {
        run = k;
        willYield = true;
        break;
      }
    }
    hooks.onDispatch?.(cur.pid, lvl, run, time);
    timeline.push({ pid: cur.pid, start: time, end: time + run, level: lvl });
    time += run;
    remaining[cur.pid]! -= run;
    // 入队运行期间到达的
    while (idx < arrived.length && arrived[idx]!.arrival <= time) {
      pushQueue(arrived[idx]!, 0);
      idx++;
    }
    if (remaining[cur.pid]! === 0) {
      completion[cur.pid] = time;
      hooks.onComplete?.(cur.pid, time);
      done++;
    } else if (willYield) {
      // 保持原级
      pushQueue(cur, lvl);
    } else if (lvl < levels - 1) {
      // 降级
      curLevel[cur.pid] = lvl + 1;
      hooks.onDemote?.(cur.pid, lvl, lvl + 1);
      pushQueue(cur, lvl + 1);
    } else {
      // 已在最低级，轮转
      pushQueue(cur, lvl);
    }
  }

  const waiting: Record<string, number> = {};
  let tw = 0;
  for (const p of procs) {
    waiting[p.pid] = completion[p.pid]! - p.arrival - p.burst;
    tw += waiting[p.pid]!;
  }
  hooks.onResult?.(tw / n);
  return { completion, waiting, timeline };
}
