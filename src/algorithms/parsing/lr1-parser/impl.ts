// =============================================================================
// LR(1) 分析器 · 纯算法实现
// 项目形如 [产生式下标, 点位置, lookahead 集合]。
// 闭包用 FIRST(β a) 传播向前看；ACTION/GOTO 构表；移进-归约分析。
// 零 DOM 依赖，可独立单测。
// =============================================================================

export interface Production {
  lhs: string;
  rhs: string[];
}

export interface Grammar {
  productions: Production[]; // 产生式 0 为 S' → start
  nonTerminals: Set<string>;
  terminals: Set<string>;
  start: string;
}

/** LR(1) 项目：[产生式下标, 点位置, lookahead]。 */
export interface LR1Item {
  prod: number;
  dot: number;
  la: string; // 单个向前看符号
}

export interface ItemSet {
  id: number;
  items: LR1Item[];
}

export interface Lr1Hooks {
  onShift?: (token: string, fromState: number, toState: number) => void;
  onReduce?: (prodIndex: number, lhs: string, rhsLength: number) => void;
  onAccept?: () => void;
  onError?: (token: string, state: number) => void;
}

export interface ParseResult {
  accepted: boolean;
  steps: Array<{ stack: number[]; input: string; action: string }>;
}

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

/** FIRST(符号串) 工具：对符号序列求 FIRST（含 ε）。 */
function firstOfSequence(
  seq: string[],
  g: Grammar,
  firstCache: Map<string, Set<string>>,
): Set<string> {
  const result = new Set<string>();
  let allEps = true;
  for (const sym of seq) {
    if (g.terminals.has(sym) || sym === '$') {
      result.add(sym);
      allEps = false;
      break;
    }
    const f = firstCache.get(sym);
    if (f) {
      for (const x of f) if (x !== 'ε') result.add(x);
      if (!f.has('ε')) {
        allEps = false;
        break;
      }
    }
  }
  if (allEps) result.add('ε');
  return result;
}

/** 预计算所有非终结符的 FIRST 集。 */
export function computeFirst(g: Grammar): Map<string, Set<string>> {
  const first = new Map<string, Set<string>>();
  for (const t of g.terminals) first.set(t, new Set([t]));
  first.set('$', new Set(['$']));
  for (const nt of g.nonTerminals) first.set(nt, new Set());
  let changed = true;
  while (changed) {
    changed = false;
    for (const prod of g.productions) {
      const f = first.get(prod.lhs)!;
      const before = f.size;
      const seqFirst = firstOfSequence(prod.rhs, g, first);
      for (const x of seqFirst) {
        if (x !== 'ε') f.add(x);
      }
      if (seqFirst.has('ε')) f.add('ε');
      if (f.size > before) changed = true;
    }
  }
  return first;
}

/** LR(1) 闭包。 */
function closure(items: LR1Item[], g: Grammar, first: Map<string, Set<string>>): LR1Item[] {
  const result: LR1Item[] = items.map((it) => ({ ...it }));
  const keyOf = (it: LR1Item): string => `${it.prod},${it.dot},${it.la}`;
  const seen = new Set(result.map(keyOf));
  let changed = true;
  while (changed) {
    changed = false;
    const len = result.length;
    for (let i = 0; i < len; i++) {
      const it = result[i]!;
      const prod = g.productions[it.prod]!;
      const B = prod.rhs[it.dot];
      if (B === undefined || !g.nonTerminals.has(B)) continue;
      // β = 点后第 2 个起的符号；向前看 = FIRST(β it.la)
      const beta = prod.rhs.slice(it.dot + 1);
      const laSeq = firstOfSequence([...beta, it.la], g, first);
      for (const a of laSeq) {
        if (a === 'ε') continue;
        for (let p = 0; p < g.productions.length; p++) {
          if (g.productions[p]!.lhs === B) {
            const newItem: LR1Item = { prod: p, dot: 0, la: a };
            const k = keyOf(newItem);
            if (!seen.has(k)) {
              seen.add(k);
              result.push(newItem);
              changed = true;
            }
          }
        }
      }
    }
  }
  result.sort((a, b) => a.prod - b.prod || a.dot - b.dot || (a.la < b.la ? -1 : 1));
  return result;
}

/** goto(I, X)。 */
function goTo(items: LR1Item[], X: string, g: Grammar, first: Map<string, Set<string>>): LR1Item[] {
  const moved: LR1Item[] = [];
  for (const it of items) {
    const prod = g.productions[it.prod]!;
    if (prod.rhs[it.dot] === X) {
      moved.push({ prod: it.prod, dot: it.dot + 1, la: it.la });
    }
  }
  return closure(moved, g, first);
}

function signature(items: LR1Item[]): string {
  return items.map((it) => `${it.prod}:${it.dot}:${it.la}`).join('|');
}

/** 构造 LR(1) 项目集规范族。 */
export function buildItemSets(g: Grammar): { sets: ItemSet[]; transitions: Map<string, number> } {
  const first = computeFirst(g);
  const startItem = closure([{ prod: 0, dot: 0, la: '$' }], g, first);
  const sets: ItemSet[] = [{ id: 0, items: startItem }];
  const transitions = new Map<string, number>();
  const sigToId = new Map<string, number>();
  sigToId.set(signature(startItem), 0);
  const symbols = [...g.nonTerminals, ...g.terminals];

  let changed = true;
  while (changed) {
    changed = false;
    const curLen = sets.length;
    for (let s = 0; s < curLen; s++) {
      for (const sym of symbols) {
        const next = goTo(sets[s]!.items, sym, g, first);
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

export interface ActionTable {
  action: Map<string, { type: 'shift' | 'reduce' | 'accept'; target?: number; prod?: number }>;
  goto: Map<string, number>;
  conflicts: number;
}

export function buildTable(g: Grammar): { sets: ItemSet[]; table: ActionTable } {
  const { sets, transitions } = buildItemSets(g);
  const action = new Map<
    string,
    { type: 'shift' | 'reduce' | 'accept'; target?: number; prod?: number }
  >();
  const gotoMap = new Map<string, number>();
  let conflicts = 0;

  for (const state of sets) {
    for (const it of state.items) {
      const prod = g.productions[it.prod]!;
      const symAfter = prod.rhs[it.dot];
      if (symAfter === undefined) {
        if (it.prod === 0 && it.la === '$') {
          const k = `${state.id},$`;
          if (action.has(k)) conflicts++;
          action.set(k, { type: 'accept' });
        } else {
          const k = `${state.id},${it.la}`;
          const existing = action.get(k);
          if (existing && (existing.type !== 'reduce' || existing.prod !== it.prod)) conflicts++;
          action.set(k, { type: 'reduce', prod: it.prod });
        }
      } else if (g.terminals.has(symAfter)) {
        const target = transitions.get(`${state.id},${symAfter}`);
        if (target !== undefined) {
          const k = `${state.id},${symAfter}`;
          if (action.has(k) && action.get(k)!.type !== 'shift') conflicts++;
          action.set(k, { type: 'shift', target });
        }
      } else if (g.nonTerminals.has(symAfter)) {
        const target = transitions.get(`${state.id},${symAfter}`);
        if (target !== undefined) gotoMap.set(`${state.id},${symAfter}`, target);
      }
    }
  }

  return { sets, table: { action, goto: gotoMap, conflicts } };
}

export function lr1Parse(input: string[], g: Grammar, hooks: Lr1Hooks = {}): ParseResult {
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
      hooks.onAccept?.();
      return { accepted: true, steps };
    }
  }
}

// 示例文法：S → CC；C → cC | d（经典 LR(1) 教学文法）
export const SAMPLE_PRODUCTIONS: Production[] = [
  { lhs: 'S', rhs: ['C', 'C'] },
  { lhs: 'C', rhs: ['c', 'C'] },
  { lhs: 'C', rhs: ['d'] },
];

export function makeSampleGrammar(): Grammar {
  return augment(SAMPLE_PRODUCTIONS, 'S', ['S', 'C'], ['c', 'd']);
}
