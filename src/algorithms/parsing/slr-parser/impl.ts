// =============================================================================
// SLR(1) 分析器 · 纯算法实现
// 1) 增广文法；2) 求 FIRST/FOLLOW；3) 构造 LR(0) 项目集规范族；
// 4) ACTION/GOTO 表（用 FOLLOW 消解归约）；5) 移进-归约分析。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** 文法产生式。 */
export interface Production {
  lhs: string; // 非终结符
  rhs: string[]; // 右部符号序列（终结符/非终结符），可为空（ε）
}

/** 增广文法。 */
export interface Grammar {
  /** 增广后的产生式列表，产生式 0 必为 S' → S。 */
  productions: Production[];
  /** 非终结符集合。 */
  nonTerminals: Set<string>;
  /** 终结符集合。 */
  terminals: Set<string>;
  /** 起始符（原文法）。 */
  start: string;
}

/** LR(0) 项目：[产生式下标, 点位置]。 */
export interface Item {
  prod: number;
  dot: number;
}

/** LR(0) 状态（项目集）。 */
export interface ItemSet {
  id: number;
  items: Item[];
}

/** 事件钩子。 */
export interface SlrHooks {
  onShift?: (token: string, fromState: number, toState: number) => void;
  onReduce?: (prodIndex: number, lhs: string, rhsLength: number) => void;
  onGoto?: (nonTerminal: string, fromState: number, toState: number) => void;
  onAccept?: () => void;
  onError?: (token: string, state: number) => void;
}

export interface ParseResult {
  accepted: boolean;
  steps: Array<{ stack: number[]; input: string; action: string }>;
}

/** 增广文法：在开头插入 S' → start。 */
export function augment(
  productions: Production[],
  start: string,
  nonTerminals: Iterable<string>,
  terminals: Iterable<string>,
): Grammar {
  const aug: Production = { lhs: start + "'", rhs: [start] };
  return {
    productions: [aug, ...productions],
    nonTerminals: new Set([start + "'", ...nonTerminals]),
    terminals: new Set(terminals),
    start,
  };
}

/** 求某项目集的闭包。 */
function closure(items: Item[], g: Grammar): Item[] {
  const result: Item[] = items.map((it) => ({ ...it }));
  const keyOf = (it: Item): string => `${it.prod},${it.dot}`;
  const seen = new Set(result.map(keyOf));
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < result.length; i++) {
      const it = result[i]!;
      const prod = g.productions[it.prod]!;
      const sym = prod.rhs[it.dot]; // 点后符号，undefined 表示点在末尾
      if (sym !== undefined && g.nonTerminals.has(sym)) {
        for (let p = 0; p < g.productions.length; p++) {
          if (g.productions[p]!.lhs === sym) {
            const newItem: Item = { prod: p, dot: 0 };
            if (!seen.has(keyOf(newItem))) {
              seen.add(keyOf(newItem));
              result.push(newItem);
              changed = true;
            }
          }
        }
      }
    }
  }
  // 排序保证确定性
  result.sort((a, b) => a.prod - b.prod || a.dot - b.dot);
  return result;
}

/** goto(I, X)：对 I 中点后为 X 的项目点前移，再求闭包。 */
function goTo(items: Item[], X: string, g: Grammar): Item[] {
  const moved: Item[] = [];
  for (const it of items) {
    const prod = g.productions[it.prod]!;
    if (prod.rhs[it.dot] === X) {
      moved.push({ prod: it.prod, dot: it.dot + 1 });
    }
  }
  return closure(moved, g);
}

/** 项目集签名（用于去重）。 */
function signature(items: Item[]): string {
  return items.map((it) => `${it.prod}:${it.dot}`).join('|');
}

/** 构造 LR(0) 项目集规范族（所有状态）。 */
export function buildItemSets(g: Grammar): { sets: ItemSet[]; transitions: Map<string, number> } {
  const startItem = closure([{ prod: 0, dot: 0 }], g);
  const sets: ItemSet[] = [{ id: 0, items: startItem }];
  const transitions = new Map<string, number>(); // key: "fromState,symbol" → toState
  const sigToId = new Map<string, number>();
  sigToId.set(signature(startItem), 0);
  const symbols = [...g.nonTerminals, ...g.terminals];

  let changed = true;
  while (changed) {
    changed = false;
    const currentLen = sets.length;
    for (let s = 0; s < currentLen; s++) {
      for (const sym of symbols) {
        const next = goTo(sets[s]!.items, sym, g);
        if (next.length === 0) continue;
        const sig = signature(next);
        let targetId = sigToId.get(sig);
        if (targetId === undefined) {
          targetId = sets.length;
          sets.push({ id: targetId, items: next });
          sigToId.set(sig, targetId);
          changed = true;
        }
        transitions.set(`${s},${sym}`, targetId);
      }
    }
  }
  return { sets, transitions };
}

/** 求 FIRST 集（SLR 中终结符 FIRST=自身，非终结符递归）。 */
export function computeFirst(g: Grammar): Map<string, Set<string>> {
  const first = new Map<string, Set<string>>();
  for (const t of g.terminals) first.set(t, new Set([t]));
  for (const nt of g.nonTerminals) first.set(nt, new Set());
  let changed = true;
  while (changed) {
    changed = false;
    for (const prod of g.productions) {
      const f = first.get(prod.lhs)!;
      const before = f.size;
      if (prod.rhs.length === 0) {
        f.add('ε');
      } else {
        for (const sym of prod.rhs) {
          const fs = first.get(sym);
          if (fs) {
            for (const x of fs) if (x !== 'ε') f.add(x);
            if (!fs.has('ε')) break;
          }
        }
        // 若整条 rhs 都可 ε（此处简化：空 rhs 已处理）
      }
      if (f.size > before) changed = true;
    }
  }
  return first;
}

/** 求 FOLLOW 集。 */
export function computeFollow(g: Grammar): Map<string, Set<string>> {
  const follow = new Map<string, Set<string>>();
  for (const nt of g.nonTerminals) follow.set(nt, new Set());
  // 起始符 S' 的 FOLLOW 含 $
  follow.get(g.productions[0]!.lhs)!.add('$');
  const first = computeFirst(g);
  let changed = true;
  while (changed) {
    changed = false;
    for (const prod of g.productions) {
      for (let i = 0; i < prod.rhs.length; i++) {
        const B = prod.rhs[i]!;
        if (!g.nonTerminals.has(B)) continue;
        const followB = follow.get(B)!;
        const before = followB.size;
        const rest = prod.rhs.slice(i + 1);
        let allEps = true;
        for (const sym of rest) {
          const fs = first.get(sym) ?? new Set<string>();
          for (const x of fs) if (x !== 'ε') followB.add(x);
          if (!fs.has('ε')) {
            allEps = false;
            break;
          }
        }
        if (allEps) {
          for (const x of follow.get(prod.lhs)!) followB.add(x);
        }
        if (followB.size > before) changed = true;
      }
    }
  }
  return follow;
}

/** 构造 ACTION/GOTO 表。 */
export interface ActionTable {
  // ACTION[state][terminal] = { type: 'shift'|'reduce'|'accept', target?: number, prod?: number }
  action: Map<string, { type: 'shift' | 'reduce' | 'accept'; target?: number; prod?: number }>;
  // GOTO[state][nonTerminal] = state
  goto: Map<string, number>;
  /** 冲突数。 */
  conflicts: number;
}

export function buildTable(g: Grammar): {
  sets: ItemSet[];
  table: ActionTable;
  follow: Map<string, Set<string>>;
} {
  const { sets, transitions } = buildItemSets(g);
  const follow = computeFollow(g);
  const action = new Map<
    string,
    { type: 'shift' | 'reduce' | 'accept'; target?: number; prod?: number }
  >();
  const goto = new Map<string, number>();
  let conflicts = 0;

  for (const state of sets) {
    for (const it of state.items) {
      const prod = g.productions[it.prod]!;
      const symAfter = prod.rhs[it.dot];
      if (symAfter === undefined) {
        // 归约项目 A → α·
        if (it.prod === 0) {
          // S' → S· ：接受
          const k = `${state.id},$`;
          if (action.has(k)) conflicts++;
          action.set(k, { type: 'accept' });
        } else {
          // 对每个 a ∈ FOLLOW(A)，ACTION[state, a] = reduce(it.prod)
          for (const a of follow.get(prod.lhs) ?? []) {
            if (a === 'ε') continue;
            const k = `${state.id},${a}`;
            if (action.has(k)) conflicts++;
            action.set(k, { type: 'reduce', prod: it.prod });
          }
        }
      } else if (g.terminals.has(symAfter)) {
        // 移进：ACTION[state, symAfter] = shift(target)
        const target = transitions.get(`${state.id},${symAfter}`);
        if (target !== undefined) {
          const k = `${state.id},${symAfter}`;
          if (action.has(k) && action.get(k)!.type !== 'shift') conflicts++;
          action.set(k, { type: 'shift', target });
        }
      } else if (g.nonTerminals.has(symAfter)) {
        // GOTO
        const target = transitions.get(`${state.id},${symAfter}`);
        if (target !== undefined) {
          goto.set(`${state.id},${symAfter}`, target);
        }
      }
    }
  }

  return { sets, table: { action, goto, conflicts }, follow };
}

/** SLR(1) 分析。输入为终结符数组（每个元素一个 token）。 */
export function slrParse(input: string[], g: Grammar, hooks: SlrHooks = {}): ParseResult {
  const { table } = buildTable(g);
  const stateStack: number[] = [0];
  const symStack: string[] = [];
  const tokens = [...input, '$'];
  let pos = 0;
  const steps: ParseResult['steps'] = [];

  while (true) {
    const s = stateStack[stateStack.length - 1]!;
    const a = tokens[pos]!;
    const act = table.action.get(`${s},${a}`);
    steps.push({
      stack: [...stateStack],
      input: tokens.slice(pos).join(''),
      action: act
        ? `${act.type}${act.target !== undefined ? `(${act.target})` : ''}${act.prod !== undefined ? `(${act.prod})` : ''}`
        : 'error',
    });
    if (act === undefined) {
      hooks.onError?.(a, s);
      return { accepted: false, steps };
    }
    if (act.type === 'shift') {
      symStack.push(a);
      stateStack.push(act.target!);
      pos++;
      hooks.onShift?.(a, s, act.target!);
    } else if (act.type === 'reduce') {
      const prod = g.productions[act.prod!]!;
      for (let i = 0; i < prod.rhs.length; i++) {
        stateStack.pop();
        symStack.pop();
      }
      const top = stateStack[stateStack.length - 1]!;
      const gt = table.goto.get(`${top},${prod.lhs}`);
      symStack.push(prod.lhs);
      stateStack.push(gt!);
      hooks.onReduce?.(act.prod!, prod.lhs, prod.rhs.length);
    } else {
      // accept
      hooks.onAccept?.();
      return { accepted: true, steps };
    }
  }
}

// ---------------------------------------------------------------------------
// 示例文法：经典表达式文法（SLR 可处理）
//   E → E + T | T
//   T → T * F | F
//   F → ( E ) | id
// 增广：E' → E
// ---------------------------------------------------------------------------
export const SAMPLE_PRODUCTIONS: Production[] = [
  { lhs: 'E', rhs: ['E', '+', 'T'] },
  { lhs: 'E', rhs: ['T'] },
  { lhs: 'T', rhs: ['T', '*', 'F'] },
  { lhs: 'T', rhs: ['F'] },
  { lhs: 'F', rhs: ['(', 'E', ')'] },
  { lhs: 'F', rhs: ['id'] },
];

export function makeSampleGrammar(): Grammar {
  return augment(SAMPLE_PRODUCTIONS, 'E', ['E', 'T', 'F'], ['+', '*', '(', ')', 'id']);
}
