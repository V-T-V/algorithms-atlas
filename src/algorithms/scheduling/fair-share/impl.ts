// 公平份额调度（Fair-Share）· 纯算法实现
// 按用户份额分配 CPU，避免单用户多进程独占。

export interface FsProcess {
  id: string;
  user: string;
  burst: number; // 总需求时间单位
}

export interface FsUserShare {
  user: string;
  share: number; // 份额权重（>0）
}

export interface FsSegment {
  id: string;
  user: string;
  start: number;
  finish: number;
}

export interface FsStat {
  id: string;
  user: string;
  burst: number;
  completion: number;
  allocated: number;
  wait: number;
}

export interface FsResult {
  segments: FsSegment[];
  stats: FsStat[];
  avgWait: number;
  avgTurnaround: number;
  /** 每个用户实际获得的 CPU 时间。 */
  userCpu: Record<string, number>;
}

/** 事件钩子。 */
export interface FsHooks {
  /** 选择某进程运行一个时间单位（给出其 used/entitled 比）。 */
  onPick?: (proc: FsProcess, ratio: number, time: number) => void;
  /** 某进程完成。 */
  onComplete?: (stat: FsStat) => void;
}

/**
 * 公平份额调度（时间片=1 的非抢占式近似）。
 *
 * 规则：
 *  - 每个用户 share 决定其应得 CPU 比例
 *  - 进程的「应得份额」= userShare / totalShare / userProcessCount
 *  - 每个时间单位选 used/entitled 比最低的未完成进程运行
 *  - userProcessCount 用「该用户当前未完成进程数」动态计算
 *
 * @param processes 进程列表
 * @param shares 用户份额列表
 * @param hooks 可选事件钩子
 */
export function fairShare(
  processes: readonly FsProcess[],
  shares: readonly FsUserShare[],
  hooks: FsHooks = {},
): FsResult {
  const n = processes.length;
  if (n === 0) return { segments: [], stats: [], avgWait: 0, avgTurnaround: 0, userCpu: {} };

  const shareMap = new Map<string, number>();
  for (const s of shares) shareMap.set(s.user, s.share);
  for (const p of processes) {
    if (!shareMap.has(p.user)) shareMap.set(p.user, 1);
  }
  const totalShare = [...shareMap.values()].reduce((a, b) => a + b, 0);

  // 工作副本
  const remaining = new Map<string, number>();
  const allocated = new Map<string, number>();
  for (const p of processes) {
    remaining.set(p.id, p.burst);
    allocated.set(p.id, 0);
  }
  const done = new Set<string>();
  const completion = new Map<string, number>();
  const userCpu: Record<string, number> = {};
  for (const u of shareMap.keys()) userCpu[u] = 0;

  const segments: FsSegment[] = [];
  let time = 0;
  const totalBurst = processes.reduce((s, p) => s + p.burst, 0);

  for (let step = 0; step < totalBurst; step++) {
    // 当前活跃进程
    const active = processes.filter((p) => !done.has(p.id));
    if (active.length === 0) break;

    // 各用户活跃进程数
    const userActive = new Map<string, number>();
    for (const p of active) userActive.set(p.user, (userActive.get(p.user) ?? 0) + 1);

    // 找 used/entitled 最低
    let best: FsProcess | null = null;
    let bestRatio = Infinity;
    for (const p of active) {
      const sh = shareMap.get(p.user) ?? 1;
      const uc = userActive.get(p.user) ?? 1;
      const entitled = sh / totalShare / uc; // 该进程本步的应得份额
      const used = (allocated.get(p.id) ?? 0) + 1e-9; // 已分配
      // 用户层面 used: 用户已得 CPU
      const userUsed = userCpu[p.user] ?? 0;
      const userEntitled = sh / totalShare;
      const userRatio = (userUsed + 1e-9) / userEntitled;
      void entitled;
      const ratio = userRatio + (used / (uc * (userEntitled + 1e-9))) * 0.01; // 用户间公平为主，进程间为辅
      if (ratio < bestRatio) {
        bestRatio = ratio;
        best = p;
      }
    }
    if (!best) break;
    const p = best;
    hooks.onPick?.(p, bestRatio, time);

    const seg: FsSegment = { id: p.id, user: p.user, start: time, finish: time + 1 };
    // 合并相邻同 id
    const last = segments[segments.length - 1];
    if (last && last.id === p.id && last.finish === time) {
      last.finish = time + 1;
    } else {
      segments.push(seg);
    }
    allocated.set(p.id, (allocated.get(p.id) ?? 0) + 1);
    userCpu[p.user] = (userCpu[p.user] ?? 0) + 1;
    remaining.set(p.id, (remaining.get(p.id) ?? 0) - 1);
    time++;
    if ((remaining.get(p.id) ?? 0) <= 0) {
      done.add(p.id);
      completion.set(p.id, time);
      const stat: FsStat = {
        id: p.id,
        user: p.user,
        burst: p.burst,
        completion: time,
        allocated: allocated.get(p.id) ?? 0,
        wait: time - p.burst,
      };
      hooks.onComplete?.(stat);
    }
  }

  const stats: FsStat[] = processes.map((p) => {
    const comp = completion.get(p.id) ?? 0;
    const alloc = allocated.get(p.id) ?? 0;
    return {
      id: p.id,
      user: p.user,
      burst: p.burst,
      completion: comp,
      allocated: alloc,
      wait: comp - p.burst,
    };
  });
  const avgWait = stats.reduce((s, x) => s + x.wait, 0) / n;
  const avgTurn = stats.reduce((s, x) => s + x.completion, 0) / n;

  return { segments, stats, avgWait, avgTurnaround: avgTurn, userCpu };
}
