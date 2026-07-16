// TD(λ) · 实现

/** 一条轨迹：状态序列与奖励序列（rewards[t] 是 s_t -> s_{t+1} 的奖励；最后状态为终止）。 */
export interface Episode {
  states: number[];
  rewards: number[];
}

export interface TdLambdaOpts {
  gamma: number;
  lambda: number;
  alpha: number;
  episodes: number;
  hooks?: {
    onEpisode?: (ep: number, V: Float64Array, mse: number) => void;
    onUpdate?: (s: number, oldValue: number, newValue: number) => void;
  };
}

/** n 步回报：从 t 开始往 n 步累加折扣奖励 + γ^n·V(s_{t+n})（若存在）。 */
export function nStepReturn(
  ep: Episode,
  t: number,
  n: number,
  V: Float64Array,
  gamma: number,
): number {
  let g = 0;
  let weight = 1;
  const last = Math.min(n, ep.states.length - 1 - t);
  for (let k = 0; k < last; k++) {
    g += weight * ep.rewards[t + k]!;
    weight *= gamma;
  }
  // bootstrap at t+n if it exists
  if (t + n < ep.states.length) {
    g += Math.pow(gamma, n) * V[ep.states[t + n]!]!;
  }
  return g;
}

/** λ-回报 G_t^λ：标准公式
 *  G_t^λ = (1−λ)·Σ_{n=1}^{N−1} λ^{n−1}·G_t^{(n)} + λ^{N−1}·G_t^{(N)},
 *  其中 N = T−t 是从 t 到终止的最大步数，最后一项（真实回报）权重为 λ^{N−1}。
 *  λ=0 → TD(0)（仅 1 步），λ=1 → 蒙特卡洛（仅末项）。
 */
export function lambdaReturn(
  ep: Episode,
  t: number,
  V: Float64Array,
  gamma: number,
  lambda: number,
): number {
  const T = ep.states.length - 1; // 终止状态下标
  const N = T - t; // 从 t 到终止的步数
  if (N <= 0) return V[ep.states[t]!]!; // 已在终止，无回报
  let gLambda = 0;
  // 前 N−1 个 n-步回报：(1−λ)·λ^{n−1}·G^(n)
  for (let n = 1; n < N; n++) {
    gLambda += (1 - lambda) * Math.pow(lambda, n - 1) * nStepReturn(ep, t, n, V, gamma);
  }
  // 末项：λ^{N−1}·G^(N)（真实回报，不 bootstrap）
  gLambda += Math.pow(lambda, N - 1) * nStepReturn(ep, t, N, V, gamma);
  return gLambda;
}

/** 前向视图 TD(λ) 训练。 */
export function tdLambda(nStates: number, data: Episode[], opts: TdLambdaOpts): Float64Array {
  const { gamma, lambda, alpha, episodes, hooks } = opts;
  const V = new Float64Array(nStates);
  for (let ep = 0; ep < episodes; ep++) {
    const e = data[ep % data.length]!;
    let mse = 0;
    for (let t = 0; t < e.states.length - 1; t++) {
      const s = e.states[t]!;
      const gLambda = lambdaReturn(e, t, V, gamma, lambda);
      const oldV = V[s]!;
      const newV = oldV + alpha * (gLambda - oldV);
      V[s] = newV;
      mse += (gLambda - oldV) ** 2;
      hooks?.onUpdate?.(s, oldV, newV);
    }
    hooks?.onEpisode?.(ep, V, mse / Math.max(1, e.states.length - 1));
  }
  return V;
}
