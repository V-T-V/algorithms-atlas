// 单层记忆博弈搜索 · 实现

export interface Mem1Hooks {
  onIterate?: (iter: number, delta: number) => void;
  onConverge?: (iterations: number, values: number[]) => void;
}

/**
 * Memory-1 重复博弈价值迭代。
 * @param nStates 状态数（= 联合动作数，如 2x2 博弈有 4 状态）
 * @param policy policy[s][a] = 在状态 s 采取联合动作 a 的概率
 * @param reward reward[s][a] = 状态 s 下动作 a 的即时奖励（玩家 1 视角）
 * @param gamma 折扣
 * @param tol 收敛阈值
 */
export function memory1ValueIteration(
  nStates: number,
  policy: number[][],
  reward: number[][],
  gamma: number,
  tol = 1e-6,
  hooks: Mem1Hooks = {},
): { values: number[]; iterations: number } {
  let V = new Array<number>(nStates).fill(0);
  let iter = 0;
  const maxIter = 10000;
  while (iter < maxIter) {
    iter++;
    const newV = new Array<number>(nStates).fill(0);
    for (let s = 0; s < nStates; s++) {
      let sum = 0;
      for (let a = 0; a < nStates; a++) {
        const p = policy[s]![a] ?? 0;
        if (p === 0) continue;
        const r = reward[s]![a] ?? 0;
        // 下一状态 = a（上一回合联合动作成为新状态）
        sum += p * (r + gamma * V[a]!);
      }
      newV[s] = sum;
    }
    let delta = 0;
    for (let s = 0; s < nStates; s++) delta = Math.max(delta, Math.abs(newV[s]! - V[s]!));
    V = newV;
    hooks.onIterate?.(iter, delta);
    if (delta < tol) {
      hooks.onConverge?.(iter, V);
      break;
    }
  }
  return { values: V, iterations: iter };
}

/** 经典以牙还牙（Tit-for-Tat）策略的概率表（2x2 博弈，4 状态）。 */
export function titForTatPolicy(): number[][] {
  // 状态 0=CC, 1=CD, 2=DC, 3=DD（C=合作, D=背叛）
  // TFT：复制对手上一动作。玩家1 下一动作 = 玩家2 上一动作。
  // 联合动作 a 的概率：玩家1 选 C/D，玩家2 (TFT) 选玩家1 的上一动作。
  // 简化：对称 TFT 双方
  const P = Array.from({ length: 4 }, () => new Array<number>(4).fill(0));
  // 状态 s -> 下一联合动作：双方都复制对方上一动作
  // s=CC: 玩家1 上一=C，玩家2 复制 -> 都 C -> a=CC(0)
  P[0]![0] = 1;
  // s=CD: 玩家1 上一=C，玩家2 上一=D；玩家1 复制对方=D，玩家2 复制对方=C -> a=DC(2)
  P[1]![2] = 1;
  // s=DC: 对称 -> a=CD(1)
  P[2]![1] = 1;
  // s=DD: 都复制对方 -> 都 D -> a=DD(3)
  P[3]![3] = 1;
  return P;
}

/** 囚徒困境奖励矩阵（玩家1 视角，状态=上一联合动作）。 */
export function prisonerReward(): number[][] {
  // R(s, a): 状态 s 下采取联合动作 a 的奖励
  // 联合动作: CC=0, CD=1, DC=2, DD=3
  // 玩家1 奖励: CC=3(R), CD=0(S), DC=5(T), DD=1(P)
  const rewardByA = [3, 0, 5, 1];
  return Array.from({ length: 4 }, () => [...rewardByA]);
}
