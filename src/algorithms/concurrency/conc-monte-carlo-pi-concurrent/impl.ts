// 并行蒙特卡洛 Pi · 实现

export type Rng = () => number;

/** LCG 确定性 RNG。 */
export function makeLcg(seed: number): Rng {
  let state = seed >>> 0;
  return (): number => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

export interface WorkerResult {
  workerId: number;
  thrown: number;
  hits: number;
}

/** 单工作线程：投 n 次，统计落入单位圆第一象限的点数。 */
export function mcWorker(workerId: number, n: number, rng: Rng): WorkerResult {
  let hits = 0;
  for (let i = 0; i < n; i++) {
    const x = rng();
    const y = rng();
    if (x * x + y * y <= 1) hits++;
  }
  return { workerId, thrown: n, hits };
}

export interface McResult {
  totalThrown: number;
  totalHits: number;
  piEstimate: number;
  perWorker: WorkerResult[];
}

export interface McHooks {
  onWorkerDone?: (r: WorkerResult) => void;
  onReduce?: (totalHits: number, totalThrown: number) => void;
}

/** 并行蒙特卡洛：顺序模拟 W 个 worker 的 map，再 reduce。 */
export function parallelMonteCarloPi(
  total: number,
  workers: number,
  seed = 42,
  hooks: McHooks = {},
): McResult {
  const perWorker = Math.floor(total / workers);
  const remainder = total - perWorker * workers;
  const results: WorkerResult[] = [];
  for (let w = 0; w < workers; w++) {
    const n = perWorker + (w < remainder ? 1 : 0);
    const rng = makeLcg(seed + w * 7919);
    const r = mcWorker(w, n, rng);
    results.push(r);
    hooks.onWorkerDone?.(r);
  }
  const totalHits = results.reduce((a, r) => a + r.hits, 0);
  const totalThrown = results.reduce((a, r) => a + r.thrown, 0);
  hooks.onReduce?.(totalHits, totalThrown);
  return { totalThrown, totalHits, piEstimate: (4 * totalHits) / totalThrown, perWorker: results };
}
