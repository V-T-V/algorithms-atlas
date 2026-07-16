// =============================================================================
// 彩票调度（Lottery Scheduling）· 纯算法实现
// 概率性调度：每个进程持有若干「彩票」，每轮随机抽一张，持有者运行一个时间单位。
// 彩票数正比于「优先级 / 应得份额」。用 mulberry32 确定性 PRNG（固定种子可复现）。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露 每轮抽奖/运行/完成。
// =============================================================================

export interface Process {
  id: string;
  /** 持有彩票数（= 优先级/份额权重，须 > 0）。 */
  tickets: number;
  /** 总执行时间（CPU 突发）。 */
  burst: number;
}

export interface RunSegment {
  /** 运行的进程 id。 */
  id: string;
  /** 起始时刻。 */
  start: number;
  /** 结束时刻。 */
  finish: number;
  /** 本段抽中的彩票号。 */
  winningTicket: number;
}

export interface ProcessStat {
  id: string;
  tickets: number;
  burst: number;
  /** 完成时刻。 */
  completion: number;
  /** 实际获得的时间片数。 */
  allocated: number;
  /** 等待时间 = completion - burst。 */
  wait: number;
  /** 周转时间 = completion。 */
  turnaround: number;
}

export interface LotteryResult {
  /** 运行段序列（相邻同 id 段已合并）。 */
  segments: RunSegment[];
  /** 每个进程的统计。 */
  stats: ProcessStat[];
  /** 总抽奖次数。 */
  draws: number;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface LotteryHooks {
  /** 每轮抽奖前（给出当前彩票总数）。 */
  onDraw?: (totalTickets: number, winningTicket: number) => void;
  /** 抽中某进程（给出进程与本次抽中的彩票号区间）。 */
  onWin?: (proc: Process, winningTicket: number, lo: number, hi: number) => void;
  /** 某进程运行一个时间单位。 */
  onRun?: (proc: Process, time: number) => void;
  /** 某进程执行完成。 */
  onComplete?: (proc: Process, completion: number) => void;
}

/**
 * mulberry32 确定性 PRNG：给定 32 位种子，返回一个 () => [0,1) 的函数。
 * 相同种子产生相同序列，便于测试复现。
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function (): number {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 彩票调度（Lottery Scheduling）。
 *
 * 规则：
 *  - 每个进程持 tickets 张彩票，编号按进程顺序连续分配（P1: [0,t1), P2: [t1,t1+t2), ...）
 *  - 每轮（一个时间单位 quantum=1）抽一张彩票 [0, total)，
 *    落在哪个进程的区间就由谁运行
 *  - 运行 1 个时间单位，burst 减 1；burst 归零则完成、其彩票作废
 *  - 直到所有进程完成
 *  - 相邻同 id 的运行段会被合并
 *
 * 时间复杂度：O(D·n)，D 为总抽奖次数（= Σ burst），n 为进程数。
 *
 * @param processes 进程列表
 * @param seed PRNG 种子（默认 1）
 * @param hooks 可选事件钩子
 * @returns 调度结果
 */
export function lotterySchedule(
  processes: readonly Process[],
  seed: number = 1,
  hooks: LotteryHooks = {},
): LotteryResult {
  const n = processes.length;
  if (n === 0) {
    return { segments: [], stats: [], draws: 0 };
  }
  for (const p of processes) {
    if (p.tickets <= 0) {
      throw new RangeError(`lotterySchedule: 进程 ${p.id} 的 tickets 必须 > 0`);
    }
  }

  const rng = mulberry32(seed);
  // 剩余 burst
  const remaining = new Map<string, number>();
  for (const p of processes) remaining.set(p.id, p.burst);

  // 计算每个存活进程的彩票区间（动态，完成者区间移除）
  const buildRanges = (): Array<{ proc: Process; lo: number; hi: number }> => {
    const ranges: Array<{ proc: Process; lo: number; hi: number }> = [];
    let acc = 0;
    for (const p of processes) {
      if (remaining.get(p.id)! > 0) {
        ranges.push({ proc: p, lo: acc, hi: acc + p.tickets });
        acc += p.tickets;
      }
    }
    return ranges;
  };

  const rawSegments: RunSegment[] = [];
  const completion = new Map<string, number>();
  let time = 0;
  let draws = 0;

  while ([...remaining.values()].some((r) => r > 0)) {
    const ranges = buildRanges();
    const totalTickets = ranges.length > 0 ? ranges[ranges.length - 1]!.hi : 0;
    // 抽一张 [0, total) 的彩票
    const winning = Math.floor(rng() * totalTickets);
    draws++;
    hooks.onDraw?.(totalTickets, winning);

    // 找出持有者
    const winner = ranges.find((r) => winning >= r.lo && winning < r.hi)!;
    hooks.onWin?.(winner.proc, winning, winner.lo, winner.hi);
    hooks.onRun?.(winner.proc, time);

    // 运行 1 个时间单位
    rawSegments.push({
      id: winner.proc.id,
      start: time,
      finish: time + 1,
      winningTicket: winning,
    });
    const rem = remaining.get(winner.proc.id)! - 1;
    remaining.set(winner.proc.id, rem);
    time += 1;

    if (rem === 0) {
      completion.set(winner.proc.id, time);
      hooks.onComplete?.(winner.proc, time);
    }
  }

  // 合并相邻同 id 段
  const segments: RunSegment[] = [];
  for (const seg of rawSegments) {
    const last = segments[segments.length - 1];
    if (last && last.id === seg.id && last.finish === seg.start) {
      last.finish = seg.finish;
    } else {
      segments.push({ ...seg });
    }
  }

  const stats: ProcessStat[] = processes.map((p) => {
    const comp = completion.get(p.id)!;
    return {
      id: p.id,
      tickets: p.tickets,
      burst: p.burst,
      completion: comp,
      allocated: p.burst,
      wait: comp - p.burst,
      turnaround: comp,
    };
  });

  return { segments, stats, draws };
}
