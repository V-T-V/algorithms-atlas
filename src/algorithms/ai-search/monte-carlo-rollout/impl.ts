// =============================================================================
// 纯蒙特卡洛模拟（Monte Carlo Rollout）· 纯算法实现
// 用 Nim 游戏演示。固定种子的 LCG 保证可复现。
// =============================================================================

export type Rng = () => number;

/** 线性同余生成器（LCG），可复现随机源。 */
export function makeLcg(seed: number): Rng {
  let state = seed >>> 0;
  return (): number => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

export interface RolloutResult {
  wins: number;
  losses: number;
  draws: number;
  total: number;
  /** 站在「初始要走的玩家」视角的胜率 ∈ [0,1]。 */
  winRate: number;
}

export interface RolloutHooks {
  /** 一次 rollout 完成。outcome ∈ {'win','loss','draw'} 站在首玩家视角。 */
  onRollout?: (i: number, outcome: 'win' | 'loss' | 'draw') => void;
}

// —— Nim 领域 —— -------------------------------------------------------------

/** Nim 是否终局（全空）。 */
export function nimIsTerminal(state: number[]): boolean {
  return state.every((s) => s === 0);
}

/** 列出所有合法走法（heap 索引 + 取数）。 */
export function nimMoves(state: number[]): Array<{ heap: number; take: number }> {
  const out: Array<{ heap: number; take: number }> = [];
  for (let h = 0; h < state.length; h++) {
    const size = state[h]!;
    for (let t = 1; t <= size; t++) out.push({ heap: h, take: t });
  }
  return out;
}

/**
 * 一次随机 rollout：双方均匀随机走，返回是否首玩家胜。
 * 取到最后一颗者胜 → 当某玩家面对全空局面时，是对方取了最后一颗 → 该玩家输。
 *
 * @param state 起始局面
 * @param rng 随机源
 * @param maxSteps 防御性步数上限
 * @returns 'win' | 'loss' | 'draw'（站在首玩家视角，Nim 无平局）
 */
export function rollout(
  state: number[],
  rng: Rng,
  maxSteps: number = 1000,
): 'win' | 'loss' | 'draw' {
  const cur = [...state];
  let turn = 0; // 0 = 首玩家（MAX），1 = 对手
  for (let step = 0; step < maxSteps; step++) {
    if (nimIsTerminal(cur)) {
      // 当前要走的玩家面对空盘 → 上一个走的人取了最后一颗 → 当前玩家输
      return turn === 0 ? 'loss' : 'win';
    }
    const moves = nimMoves(cur);
    const pick = moves[Math.floor(rng() * moves.length)]!;
    cur[pick.heap] = cur[pick.heap]! - pick.take;
    turn = 1 - turn;
  }
  return 'draw'; // 超时（理论上 Nim 不会）
}

/**
 * 蒙特卡洛模拟主函数。
 *
 * @param state 起始局面
 * @param simulations 模拟次数
 * @param seed 随机种子
 * @param hooks 钩子
 */
export function monteCarloRollout(
  state: number[],
  simulations: number,
  seed: number,
  hooks: RolloutHooks = {},
): RolloutResult {
  const rng = makeLcg(seed);
  let wins = 0;
  let losses = 0;
  let draws = 0;

  for (let i = 0; i < simulations; i++) {
    const outcome = rollout(state, rng);
    if (outcome === 'win') wins++;
    else if (outcome === 'loss') losses++;
    else draws++;
    hooks.onRollout?.(i, outcome);
  }

  const total = simulations;
  const winRate = total > 0 ? wins / total : 0;
  return { wins, losses, draws, total, winRate };
}

/** 计算 Nim-和（异或）。 */
export function nimSum(state: number[]): number {
  return state.reduce((a, b) => a ^ b, 0);
}
