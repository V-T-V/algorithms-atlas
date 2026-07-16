// 循环执行调度 · 实现

export interface CeTask {
  id: string;
  period: number; // 必须是 frame 的整数倍
  execution: number;
}

export interface CeFrame {
  index: number;
  startTime: number;
  tasks: string[];
  load: number;
}

export interface CeResult {
  frameLength: number;
  majorCycle: number;
  frames: CeFrame[];
  feasible: boolean;
}

export interface CeHooks {
  onFrame?: (index: number, startTime: number, tasks: string[]) => void;
}

/**
 * 构造循环执行表：frame 长度 = 所有周期的最大公约数附近的最大值（这里取 gcd），
 * major cycle = lcm(周期)。每帧放「周期 ≤ 当前帧序号覆盖范围」的任务。
 */
export function cyclicExecutive(tasks: CeTask[], hooks: CeHooks = {}): CeResult {
  if (tasks.length === 0) return { frameLength: 0, majorCycle: 0, frames: [], feasible: true };
  const periods = tasks.map((t) => t.period);
  const frameLength = gcdList(periods);
  const majorCycle = lcmList(periods);
  const frameCount = majorCycle / frameLength;

  const frames: CeFrame[] = [];
  let feasible = true;
  for (let f = 0; f < frameCount; f++) {
    const startTime = f * frameLength;
    const frameTasks: CeTask[] = [];
    // 任务在帧 f 被调度当且仅当 f*frame 是其周期的倍数（每周期释放一次）
    for (const t of tasks) {
      if ((f * frameLength) % t.period === 0) frameTasks.push(t);
    }
    const load = frameTasks.reduce((s, t) => s + t.execution, 0);
    if (load > frameLength) feasible = false;
    const ids = frameTasks.map((t) => t.id);
    frames.push({ index: f, startTime, tasks: ids, load });
    hooks.onFrame?.(f, startTime, ids);
  }
  return { frameLength, majorCycle, frames, feasible };
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}
function gcdList(nums: number[]): number {
  return nums.reduce((a, n) => gcd(a, n), 0);
}
function lcmList(nums: number[]): number {
  return nums.reduce((acc, n) => (acc * n) / gcd(acc, n), 1);
}
