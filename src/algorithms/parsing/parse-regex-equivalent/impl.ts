// =============================================================================
// DFA/正则等价判定 · 纯算法实现
// 构造叉积 DFA，BFS 找最短区分串。
// =============================================================================

export interface DFA {
  states: string[];
  alphabet: string[];
  transitions: Record<string, Record<string, string>>;
  start: string;
  accept: string[];
}

export interface EquivalenceResult {
  equivalent: boolean;
  /** 不等价时的最短区分串（输入符号序列）；等价时为空。 */
  counterexample: string[];
  /** BFS 探索的叉积状态数。 */
  explored: number;
}

export interface EquivalenceHooks {
  /** 每访问一个叉积状态 (p,q)。 */
  onVisit?: (p: string, q: string, depth: number) => void;
  /** 找到区分态（恰好一方接受）。 */
  onDistinguish?: (p: string, q: string) => void;
  onResult?: (r: EquivalenceResult) => void;
}

const TRAP = '__TRAP__';

/**
 * 判定两个 DFA 是否等价。
 *
 * @param a DFA A
 * @param b DFA B
 * @param hooks 可选钩子
 */
export function areEquivalent(a: DFA, b: DFA, hooks: EquivalenceHooks = {}): EquivalenceResult {
  const acceptA = new Set(a.accept);
  const acceptB = new Set(b.accept);
  const alphabet = [...new Set([...a.alphabet, ...b.alphabet])];
  // 取转移：缺边 → 陷阱
  const step = (dfa: DFA, s: string, sym: string): string => {
    const t = dfa.transitions[s]?.[sym];
    return t === undefined ? TRAP : t;
  };
  // 起始对
  const startPair = `${a.start}|${b.start}`;
  const queue: Array<{ p: string; q: string; depth: number; path: string[] }> = [
    { p: a.start, q: b.start, depth: 0, path: [] },
  ];
  const visited = new Set<string>([startPair]);
  let explored = 0;

  while (queue.length > 0) {
    const { p, q, depth, path } = queue.shift()!;
    explored++;
    hooks.onVisit?.(p, q, depth);
    // 恰好一方接受 → 区分
    const pa = acceptA.has(p);
    const pb = acceptB.has(q);
    if (pa !== pb) {
      hooks.onDistinguish?.(p, q);
      const result: EquivalenceResult = {
        equivalent: false,
        counterexample: path,
        explored,
      };
      hooks.onResult?.(result);
      return result;
    }
    for (const sym of alphabet) {
      const np = step(a, p, sym);
      const nq = step(b, q, sym);
      const key = `${np}|${nq}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ p: np, q: nq, depth: depth + 1, path: [...path, sym] });
      }
    }
  }

  const result: EquivalenceResult = { equivalent: true, counterexample: [], explored };
  hooks.onResult?.(result);
  return result;
}
