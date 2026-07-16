// =============================================================================
// DFA 最小化（Moore 划分细化）· 纯算法实现
// 输入：显式 DFA；输出：最小化 DFA + 状态映射。
// =============================================================================

/** 显式 DFA。 */
export interface DFA {
  /** 状态名列表。 */
  states: string[];
  /** 字母表（输入符号）。 */
  alphabet: string[];
  /** 转移表：transitions[state][symbol] = targetState。 */
  transitions: Record<string, Record<string, string>>;
  /** 起始状态。 */
  start: string;
  /** 接受状态集合。 */
  accept: string[];
}

/** 最小化后的 DFA。 */
export interface MinimizedDFA {
  dfa: DFA;
  /** 原状态 → 新状态组代表 的映射。 */
  mapping: Record<string, string>;
  /** 划分历史（每轮的分组），用于可视化。 */
  partitions: string[][];
  /** 迭代轮数。 */
  iterations: number;
}

export interface MinimizeHooks {
  /** 每轮划分后调用：轮号、当前划分。 */
  onPartition?: (iter: number, partition: string[][]) => void;
  onResult?: (m: MinimizedDFA) => void;
}

/** 标准化一组状态名（排序），返回代表名（用第一个元素）。 */
function repOf(group: string[]): string {
  return [...group].sort()[0]!;
}

/** 比较两个划分是否相同（基于代表的集合）。 */
function samePartition(a: string[][], b: string[][]): boolean {
  if (a.length !== b.length) return false;
  const toKey = (g: string[]) => [...g].sort().join(',');
  const sa = a.map(toKey).sort();
  const sb = b.map(toKey).sort();
  return sa.every((k, i) => k === sb[i]);
}

/**
 * 用 Moore 算法最小化 DFA。
 *
 * @param dfa 输入 DFA
 * @param hooks 可选钩子
 */
export function minimizeDFA(dfa: DFA, hooks: MinimizeHooks = {}): MinimizedDFA {
  const acceptSet = new Set(dfa.accept);
  // 初始划分：接受 / 非接受（剔除孤立）
  const acceptGroup = dfa.states.filter((s) => acceptSet.has(s));
  const nonAcceptGroup = dfa.states.filter((s) => !acceptSet.has(s));
  let partition: string[][] = [acceptGroup, nonAcceptGroup].filter((g) => g.length > 0);

  const history: string[][][] = [];
  let iter = 0;
  history.push(partition.map((g) => [...g]));
  hooks.onPartition?.(iter, partition);

  while (true) {
    iter++;
    // 当前状态 → 所属组代表 的映射
    const stateToRep = new Map<string, string>();
    for (const g of partition) {
      const rep = repOf(g);
      for (const s of g) stateToRep.set(s, rep);
    }
    // 对每个组细化
    const newPartition: string[][] = [];
    for (const group of partition) {
      // 用「每个状态对所有字母的转移目标代表」作为签名
      const buckets = new Map<string, string[]>();
      for (const s of group) {
        const sigParts: string[] = [];
        for (const sym of dfa.alphabet) {
          const tgt = dfa.transitions[s]?.[sym];
          sigParts.push(tgt === undefined ? '∅' : (stateToRep.get(tgt) ?? '∅'));
        }
        const sig = sigParts.join('|');
        const bucket = buckets.get(sig);
        if (bucket) bucket.push(s);
        else buckets.set(sig, [s]);
      }
      for (const bucket of buckets.values()) newPartition.push(bucket);
    }

    hooks.onPartition?.(iter, newPartition);
    history.push(newPartition.map((g) => [...g]));

    if (samePartition(newPartition, partition)) {
      partition = newPartition;
      break;
    }
    partition = newPartition;
  }

  // 构造最小 DFA
  const mapping: Record<string, string> = {};
  for (const g of partition) {
    const rep = repOf(g);
    for (const s of g) mapping[s] = rep;
  }
  const minStates = partition.map(repOf);
  const minAccept = [...new Set(dfa.accept.map((s) => mapping[s]!))];
  const minStart = mapping[dfa.start]!;
  const minTransitions: Record<string, Record<string, string>> = {};
  for (const g of partition) {
    const rep = repOf(g);
    const sample = g[0]!;
    minTransitions[rep] = {};
    for (const sym of dfa.alphabet) {
      const tgt = dfa.transitions[sample]?.[sym];
      if (tgt !== undefined) minTransitions[rep][sym] = mapping[tgt]!;
    }
  }
  /** 每轮的划分（每个组用逗号连接的状态名）。 */
  const partitions = history.map((p) => p.map((g) => [...g].sort().join(',')));
  const result: MinimizedDFA = {
    dfa: {
      states: minStates,
      alphabet: dfa.alphabet,
      transitions: minTransitions,
      start: minStart,
      accept: minAccept,
    },
    mapping,
    partitions,
    iterations: iter,
  };
  hooks.onResult?.(result);
  return result;
}
