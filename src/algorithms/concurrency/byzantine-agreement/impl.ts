// =============================================================================
// 拜占庭协定（简化版）· 纯算法实现
// 两轮多数表决：
//   Round 1: 每个进程广播自己的初始值
//   Round 2: 每个进程转发「自己在第 1 轮收到的值」
//   Decision: 每个进程对自己在第 2 轮收到的值集合取多数
// 叛徒进程的值由调用方通过 traitorValues 提供（可任意、每轮可变）。
// =============================================================================

/** 事件钩子。 */
export interface ByzantineHooks {
  onRound1Send?: (from: number, value: number) => void;
  onRound1Receive?: (to: number, from: number, value: number) => void;
  onRound2Send?: (from: number, to: number, forwardedValue: number) => void;
  onRound2Receive?: (to: number, from: number, originalSender: number, value: number) => void;
  onDecide?: (proc: number, decision: number) => void;
}

/** 拜占庭运行结果。 */
export interface ByzantineResult {
  /** 每个进程的最终决策值。 */
  decisions: number[];
  /** 是否所有诚实进程达成一致。 */
  honestAgreement: boolean;
}

/**
 * 拜占庭协定（简化两轮）。
 * @param n 进程数
 * @param honestValues 诚实进程的初始值（长度 = n - f）
 * @param honestIndices 诚实进程的索引列表
 * @param traitorValuesByRound 叛徒每轮发送的值；traitorValuesByRound[round][from][to] = value
 * @param f 叛徒数
 */
export function runByzantine(
  n: number,
  honestValues: number[],
  honestIndices: number[],
  traitorValuesByRound: Array<Record<number, Record<number, number>>>,
  f: number,
  hooks: ByzantineHooks = {},
): ByzantineResult {
  // 初始值表：init[p] = p 的初始值（叛徒随意，但记录一个默认）
  const init = new Array<number>(n).fill(-1);
  for (let k = 0; k < honestIndices.length; k++) {
    init[honestIndices[k]!] = honestValues[k]!;
  }
  const isTraitor = new Array<boolean>(n).fill(false);
  const honestSet = new Set(honestIndices);
  for (let i = 0; i < n; i++) if (!honestSet.has(i)) isTraitor[i] = true;

  // round1Received[to][from] = value（to 收到 from 的值）
  const round1Received: Array<Record<number, number>> = Array.from({ length: n }, () => ({}));
  const round2Received: Array<Record<number, Array<{ from: number; value: number }>>> = Array.from(
    { length: n },
    () => ({}),
  );

  // —— Round 1 ——
  for (let from = 0; from < n; from++) {
    for (let to = 0; to < n; to++) {
      if (to === from) continue;
      let v: number;
      if (isTraitor[from]) {
        v = traitorValuesByRound[0]?.[from]?.[to] ?? init[from]!;
      } else {
        v = init[from]!;
      }
      hooks.onRound1Send?.(from, v);
      round1Received[to]![from] = v;
      hooks.onRound1Receive?.(to, from, v);
    }
  }

  // —— Round 2：转发 round1 收到的值 ——
  for (let forwarder = 0; forwarder < n; forwarder++) {
    for (let to = 0; to < n; to++) {
      if (to === forwarder) continue;
      // forwarder 把它「声称从 originalSender 收到」的值发给 to
      // 对每个 originalSender
      for (const originalSender of Object.keys(round1Received[forwarder]!)) {
        const os = Number(originalSender);
        let v: number;
        if (isTraitor[forwarder]) {
          v = traitorValuesByRound[1]?.[forwarder]?.[to] ?? round1Received[forwarder]![os]!;
        } else {
          v = round1Received[forwarder]![os]!;
        }
        hooks.onRound2Send?.(forwarder, to, v);
        if (!round2Received[to]![os]) round2Received[to]![os] = [];
        round2Received[to]![os]!.push({ from: forwarder, value: v });
        hooks.onRound2Receive?.(to, forwarder, os, v);
      }
    }
  }

  // —— 决策：对每个 originalSender，to 收集所有转发值 + 自己 round1 直接收到的，取多数 ——
  const decisions = new Array<number>(n).fill(-1);
  for (let p = 0; p < n; p++) {
    // 对每个 originalSender s，汇总 to 收到的关于 s 的值
    const perSenderValues: Record<number, number[]> = {};
    for (const sKey of Object.keys(round2Received[p]!)) {
      const s = Number(sKey);
      perSenderValues[s] = round2Received[p]![s]!.map((x) => x.value);
    }
    // 加上自己 round1 直接收到的
    for (const sKey of Object.keys(round1Received[p]!)) {
      const s = Number(sKey);
      if (!perSenderValues[s]) perSenderValues[s] = [];
      perSenderValues[s]!.push(round1Received[p]![s]!);
    }
    // 对每个 s 取多数，得到 to 认为 s 的值
    const inferred: Record<number, number> = {};
    for (const sKey of Object.keys(perSenderValues)) {
      const s = Number(sKey);
      inferred[s] = majority(perSenderValues[s]!);
    }
    // 最终决策 = 对所有 s 的推断值取多数（含 s 自己的初始值）
    const allValues: number[] = [];
    for (let s = 0; s < n; s++) {
      if (s in inferred) allValues.push(inferred[s]!);
      else if (s === p) allValues.push(init[p]!);
    }
    decisions[p] = majority(allValues);
    hooks.onDecide?.(p, decisions[p]!);
  }

  // 诚实进程是否一致
  const honestDecisions = honestIndices.map((i) => decisions[i]!);
  const honestAgreement = honestDecisions.every((d) => d === honestDecisions[0]);

  void f;
  return { decisions, honestAgreement };
}

/** 求众数（多数）；平局取较小值。 */
function majority(values: number[]): number {
  if (values.length === 0) return -1;
  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  let best = values[0]!;
  let bestCount = -1;
  for (const [v, c] of counts) {
    if (c > bestCount || (c === bestCount && v < best)) {
      best = v;
      bestCount = c;
    }
  }
  return best;
}
