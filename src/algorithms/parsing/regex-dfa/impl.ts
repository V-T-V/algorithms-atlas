// =============================================================================
// NFA → DFA 子集构造法 · 纯算法实现
// 输入：一个 ε-NFA（状态、起始、接受集、转移表，symbol=null 表 ε）。
// 输出：等价 DFA（状态为 NFA 状态子集的 frozenset，转移确定）。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** NFA 转移：from --symbol(ε=null)--> to。 */
export interface NfaTransition {
  from: number;
  to: number;
  symbol: string | null;
}

/** ε-NFA。 */
export interface EpsilonNfa {
  states: number;
  start: number;
  accept: number;
  transitions: NfaTransition[];
}

/** DFA 转移：from --symbol--> to（无 ε，确定）。 */
export interface DfaTransition {
  from: number;
  to: number;
  symbol: string;
}

/** DFA。 */
export interface Dfa {
  /** DFA 状态数（每个状态对应一组 NFA 状态）。 */
  states: number;
  /** 起始状态。 */
  start: number;
  /** 接受状态集合。 */
  accept: Set<number>;
  /** 转移表。 */
  transitions: DfaTransition[];
  /** 每个 DFA 状态对应的 NFA 子集（供观察）。 */
  subsets: number[][];
  /** 字母表。 */
  alphabet: string[];
}

export interface SubsetHooks {
  /** 发现一个新的 DFA 状态（子集 closure）。 */
  onDiscover?: (dfaState: number, nfaSubset: number[]) => void;
  /** 添加一条 DFA 转移。 */
  onTransition?: (from: number, symbol: string, to: number) => void;
  /** 标记接受状态。 */
  onAccept?: (dfaState: number) => void;
}

/** 求 ε-闭包：从给定 NFA 状态集只走 ε 转移能到达的所有状态。 */
export function epsilonClosure(nfaStates: Iterable<number>, nfa: EpsilonNfa): Set<number> {
  const result = new Set<number>(nfaStates);
  const stack = [...nfaStates];
  while (stack.length > 0) {
    const s = stack.pop()!;
    for (const t of nfa.transitions) {
      if (t.symbol === null && t.from === s && !result.has(t.to)) {
        result.add(t.to);
        stack.push(t.to);
      }
    }
  }
  return result;
}

/** move(T, a)：T 中经单步符号 a 转移到达的 NFA 状态。 */
export function move(T: Iterable<number>, symbol: string, nfa: EpsilonNfa): Set<number> {
  const result = new Set<number>();
  const Tset = new Set(T);
  for (const t of nfa.transitions) {
    if (t.symbol === symbol && Tset.has(t.from)) result.add(t.to);
  }
  return result;
}

/** 收集字母表（所有非 ε 转移符号）。 */
export function alphabetOf(nfa: EpsilonNfa): string[] {
  const set = new Set<string>();
  for (const t of nfa.transitions) {
    if (t.symbol !== null) set.add(t.symbol);
  }
  return [...set].sort();
}

/** 子集签名（排序后 join，用于去重）。 */
function subsetKey(s: Iterable<number>): string {
  return [...s].sort((a, b) => a - b).join(',');
}

/**
 * 子集构造：把 ε-NFA 转为 DFA。
 */
export function subsetConstruction(nfa: EpsilonNfa, hooks: SubsetHooks = {}): Dfa {
  const alphabet = alphabetOf(nfa);
  const startClosure = epsilonClosure([nfa.start], nfa);

  const subsets: number[][] = [];
  const keyToId = new Map<string, number>();
  const transitions: DfaTransition[] = [];
  const accept = new Set<number>();

  // 入队起始
  const startKey = subsetKey(startClosure);
  subsets.push([...startClosure].sort((a, b) => a - b));
  keyToId.set(startKey, 0);
  hooks.onDiscover?.(0, subsets[0]!);

  const worklist: number[] = [0];

  while (worklist.length > 0) {
    const curId = worklist.shift()!;
    const curSet = new Set(subsets[curId]!);

    for (const sym of alphabet) {
      const m = move(curSet, sym, nfa);
      if (m.size === 0) continue;
      const closure = epsilonClosure(m, nfa);
      const key = subsetKey(closure);
      let targetId = keyToId.get(key);
      if (targetId === undefined) {
        targetId = subsets.length;
        subsets.push([...closure].sort((a, b) => a - b));
        keyToId.set(key, targetId);
        hooks.onDiscover?.(targetId, subsets[targetId]!);
        worklist.push(targetId);
      }
      transitions.push({ from: curId, to: targetId, symbol: sym });
      hooks.onTransition?.(curId, sym, targetId);
    }
  }

  // 标记接受：含 NFA accept 的子集
  for (let i = 0; i < subsets.length; i++) {
    if (subsets[i]!.includes(nfa.accept)) {
      accept.add(i);
      hooks.onAccept?.(i);
    }
  }

  return { states: subsets.length, start: 0, accept, transitions, subsets, alphabet };
}

/** 在 DFA 上匹配输入串。 */
export function dfaMatch(input: string, dfa: Dfa): boolean {
  let cur = dfa.start;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i]!;
    const t = dfa.transitions.find((tr) => tr.from === cur && tr.symbol === ch);
    if (t === undefined) return false;
    cur = t.to;
  }
  return dfa.accept.has(cur);
}

// ---------------------------------------------------------------------------
// 示例 ε-NFA：识别 (a|b)*ab
//   手工构造的 Thompson 风格 NFA：
//   0 --ε--> 1, 0 --ε--> 7
//   1 --ε--> 2, 1 --ε--> 4
//   2 --a--> 3, 3 --ε--> 6
//   4 --b--> 5, 5 --ε--> 6
//   6 --ε--> 1, 6 --ε--> 7   （(a|b)* 的回环与出口）
//   7 --a--> 8
//   8 --b--> 9   （接受）
// ---------------------------------------------------------------------------
export const SAMPLE_NFA: EpsilonNfa = {
  states: 10,
  start: 0,
  accept: 9,
  transitions: [
    { from: 0, to: 1, symbol: null },
    { from: 0, to: 7, symbol: null },
    { from: 1, to: 2, symbol: null },
    { from: 1, to: 4, symbol: null },
    { from: 2, to: 3, symbol: 'a' },
    { from: 3, to: 6, symbol: null },
    { from: 4, to: 5, symbol: 'b' },
    { from: 5, to: 6, symbol: null },
    { from: 6, to: 1, symbol: null },
    { from: 6, to: 7, symbol: null },
    { from: 7, to: 8, symbol: 'a' },
    { from: 8, to: 9, symbol: 'b' },
  ],
};

// 一个更简单的示例 NFA：识别 a*b（用于演示子集构造过程更清晰）
export const SIMPLE_NFA: EpsilonNfa = {
  states: 5,
  start: 0,
  accept: 4,
  transitions: [
    { from: 0, to: 1, symbol: null },
    { from: 0, to: 3, symbol: null },
    { from: 1, to: 2, symbol: 'a' },
    { from: 2, to: 1, symbol: null },
    { from: 2, to: 3, symbol: null },
    { from: 3, to: 4, symbol: 'b' },
  ],
};
