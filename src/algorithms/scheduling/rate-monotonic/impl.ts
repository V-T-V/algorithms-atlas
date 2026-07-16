// =============================================================================
// 速率单调调度（Rate Monotonic Scheduling, RMS）· 纯算法实现
// 实时周期任务的静态优先级调度：周期越短，优先级越高（固定优先级）。
// 判定可调度性：利用率 U = Σ(Ci/Ti) ≤ n·(2^(1/n) − 1)（充分条件，Liu & Layland 1973）。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露 仿真调度步进。
// =============================================================================

export interface Task {
  id: string;
  /** 周期 T（也是相对截止期，隐含 deadline = period）。 */
  period: number;
  /** 每周期需要的执行时间 C（C ≤ T）。 */
  execution: number;
}

export interface TaskAnalysis extends Task {
  /** 利用率 Ci/Ti。 */
  utilization: number;
  /** 静态优先级（1 = 最高，按 period 升序编号）。 */
  priority: number;
}

export interface ScheduledSegment {
  id: string;
  start: number;
  finish: number;
}

export interface RateMonotonicResult {
  /** 任务分析（含利用率与优先级）。 */
  tasks: TaskAnalysis[];
  /** 总利用率 Σ(Ci/Ti)。 */
  utilization: number;
  /** Liu-Layland 利用率上界 n·(2^(1/n)−1)。 */
  bound: number;
  /** 是否满足充分可调度条件（U ≤ bound）。 */
  schedulable: boolean;
  /** 仿真期间是否所有作业都在截止期内完成（必要条件，更强）。 */
  feasible: boolean;
  /** 仿真甘特段（若 simHorizon > 0）。 */
  segments: ScheduledSegment[];
  /** 仿真时长。 */
  simHorizon: number;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface RmHooks {
  /** 每个时间步调度某任务时触发（给出时刻与剩余执行）。 */
  onStep?: (time: number, taskId: string | null, remaining: number) => void;
  /** 某任务实例（作业）完成。 */
  onJobComplete?: (taskId: string, time: number) => void;
  /** 检测到错过截止期。 */
  onDeadlineMiss?: (taskId: string, time: number) => void;
}

/**
 * Liu-Layland 利用率上界：n·(2^(1/n) − 1)。
 */
export function liuLaylandBound(n: number): number {
  if (n <= 0) return 0;
  return n * (Math.pow(2, 1 / n) - 1);
}

/**
 * 速率单调调度（Rate Monotonic）。
 *
 * 规则：
 *  - 静态优先级：period 越短优先级越高（平局按 id 字典序）
 *  - 抢占式：每个时刻运行「最高优先级且有剩余执行」的任务
 *  - 可调度性充分条件：U = Σ(Ci/Ti) ≤ n·(2^(1/n)−1)
 *  - 仿真在 [0, simHorizon] 内逐时间单位推进，检测截止期是否满足
 *
 * @param tasks 周期任务列表
 * @param hooks 可选事件钩子
 * @param simHorizon 仿真时长（默认 = 所有周期的最小公倍数，上限 200 防爆炸）
 * @returns 调度结果
 */
export function rateMonotonic(
  tasks: readonly Task[],
  hooks: RmHooks = {},
  simHorizon?: number,
): RateMonotonicResult {
  const n = tasks.length;
  if (n === 0) {
    return {
      tasks: [],
      utilization: 0,
      bound: 0,
      schedulable: true,
      feasible: true,
      segments: [],
      simHorizon: 0,
    };
  }

  // 校验：execution ≤ period
  for (const t of tasks) {
    if (t.execution > t.period) {
      throw new RangeError(
        `rateMonotonic: 任务 ${t.id} 的 execution(${t.execution}) > period(${t.period})`,
      );
    }
  }

  // 静态优先级：period 升序（平局 id）
  const ordered = [...tasks].sort((a, b) => a.period - b.period || a.id.localeCompare(b.id));
  const analyzed: TaskAnalysis[] = ordered.map((t, i) => ({
    ...t,
    utilization: t.execution / t.period,
    priority: i + 1,
  }));
  const utilization = analyzed.reduce((s, t) => s + t.utilization, 0);
  const bound = liuLaylandBound(n);
  const schedulable = utilization <= bound + 1e-9; // 容差

  // 仿真时长：默认取最小公倍数（LCM），上限 200
  const horizon = simHorizon ?? Math.min(200, lcm(analyzed.map((t) => t.period)));

  // 仿真：逐时间单位
  // 每个任务的「当前作业」：release（释放时刻）、remaining（剩余执行）、absoluteDeadline
  interface JobState {
    release: number;
    remaining: number;
    deadline: number;
  }
  const jobState = new Map<string, JobState>();
  // 初始化第一轮作业
  for (const t of analyzed) {
    jobState.set(t.id, { release: 0, remaining: t.execution, deadline: t.period });
  }

  const segments: ScheduledSegment[] = [];
  let feasible = true;
  let now = 0;

  while (now < horizon) {
    // 检查截止期：若有任务的作业已过截止期且仍有剩余 → miss
    for (const t of analyzed) {
      const st = jobState.get(t.id)!;
      if (st.remaining > 0 && now >= st.deadline) {
        // 错过截止期
        feasible = false;
        hooks.onDeadlineMiss?.(t.id, now);
        // 该作业被丢弃，开启下一轮（在下一个周期释放）
        st.remaining = 0;
      }
    }

    // 选「优先级最高（priority 最小）且有剩余」的任务
    let pick: TaskAnalysis | null = null;
    for (const t of analyzed) {
      const st = jobState.get(t.id)!;
      if (st.remaining > 0) {
        pick = t;
        break;
      }
    }

    if (pick) {
      const st = jobState.get(pick.id)!;
      const segStart = now;
      // 运行到下一个「事件点」：下一段结束 = 下一次某任务的释放时刻 或 当前作业完成
      const nextReleases = analyzed.map((t) => {
        const cur = jobState.get(t.id)!;
        // 下一次释放 = 当前 release + period
        return cur.release + t.period;
      });
      const nextEvent = Math.min(
        st.remaining,
        ...nextReleases.filter((r) => r > now).map((r) => r - now),
      );
      const runLen = isFinite(nextEvent) ? nextEvent : st.remaining;
      const segFinish = now + runLen;
      // 合并相邻同 id 段
      const last = segments[segments.length - 1];
      if (last && last.id === pick.id && last.finish === segStart) {
        last.finish = segFinish;
      } else {
        segments.push({ id: pick.id, start: segStart, finish: segFinish });
      }
      st.remaining -= runLen;
      hooks.onStep?.(now, pick.id, st.remaining);
      now = segFinish;
      if (st.remaining === 0) {
        hooks.onJobComplete?.(pick.id, now);
      }
    } else {
      // 空闲：跳到下一个释放时刻
      const nextRelease = Math.min(
        ...analyzed.map((t) => {
          const cur = jobState.get(t.id)!;
          return cur.release + t.period;
        }),
      );
      if (nextRelease <= now) {
        now += 1; // 安全推进
      } else {
        now = nextRelease;
      }
      hooks.onStep?.(now, null, 0);
    }

    // 处理新作业释放：release + period 时刻，开启新一轮
    for (const t of analyzed) {
      const st = jobState.get(t.id)!;
      while (now >= st.release + t.period) {
        st.release += t.period;
        st.deadline = st.release + t.period;
        st.remaining = t.execution;
      }
    }
  }

  return {
    tasks: analyzed,
    utilization,
    bound,
    schedulable,
    feasible,
    segments,
    simHorizon: horizon,
  };
}

/** 最小公倍数（GCD 辅助）。 */
function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b > 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

function lcm(nums: number[]): number {
  if (nums.length === 0) return 1;
  let r = nums[0]!;
  for (let i = 1; i < nums.length; i++) {
    r = (r * nums[i]!) / gcd(r, nums[i]!);
  }
  return r;
}
