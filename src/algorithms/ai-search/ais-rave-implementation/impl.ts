// RAVE 快速动作价值估计 · 实现

export interface RaveActionStat {
  action: number;
  mcVisits: number;
  mcWins: number;
  raveVisits: number;
  raveWins: number;
}

export interface RaveHooks {
  onEstimate?: (
    action: number,
    mcValue: number,
    raveValue: number,
    beta: number,
    blended: number,
  ) => void;
}

/**
 * 计算 β 权重：随 mcVisits 增大而衰减。
 * β = raveVisits / (raveVisits + mcVisits + 4·b·mcVisits·raveVisits)，简化版。
 */
export function raveBeta(mcVisits: number, raveVisits: number, b = 1): number {
  if (mcVisits + raveVisits === 0) return 1;
  return raveVisits / (raveVisits + mcVisits + 4 * b * mcVisits * raveVisits);
}

/**
 * 混合 RAVE 与 MC 估计。
 */
export function raveEstimate(stat: RaveActionStat, b = 1, hooks: RaveHooks = {}): number {
  const mcValue = stat.mcVisits > 0 ? stat.mcWins / stat.mcVisits : 0.5;
  const raveValue = stat.raveVisits > 0 ? stat.raveWins / stat.raveVisits : 0.5;
  const beta = raveBeta(stat.mcVisits, stat.raveVisits, b);
  const blended = beta * raveValue + (1 - beta) * mcValue;
  hooks.onEstimate?.(stat.action, mcValue, raveValue, beta, blended);
  return blended;
}

/**
 * 维护一组动作的 RAVE 统计。
 */
export class RaveStats {
  private stats = new Map<number, RaveActionStat>();
  constructor(private b = 1) {}

  get(action: number): RaveActionStat {
    if (!this.stats.has(action)) {
      this.stats.set(action, { action, mcVisits: 0, mcWins: 0, raveVisits: 0, raveWins: 0 });
    }
    return this.stats.get(action)!;
  }

  /** 记录一次模拟：主动作的 MC 结果 + 所有动作的 AMAF 结果。 */
  recordRollout(
    mainAction: number,
    reward: number,
    allActions: number[],
    hooks: RaveHooks = {},
  ): void {
    // MC 统计：仅主动作
    const s = this.get(mainAction);
    s.mcVisits++;
    s.mcWins += reward;
    // RAVE/AMAF 统计：所有出现过的动作
    for (const a of allActions) {
      const ra = this.get(a);
      ra.raveVisits++;
      ra.raveWins += reward;
    }
    // 触发估计
    raveEstimate(s, this.b, hooks);
  }

  /** 获取所有动作的混合估计。 */
  estimates(hooks: RaveHooks = {}): Array<{ action: number; value: number }> {
    const result: Array<{ action: number; value: number }> = [];
    for (const [, s] of this.stats)
      result.push({ action: s.action, value: raveEstimate(s, this.b, hooks) });
    return result;
  }
}
