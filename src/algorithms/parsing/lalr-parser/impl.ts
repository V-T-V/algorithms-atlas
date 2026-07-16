// =============================================================================
// LALR(1) 分析器 · 纯算法实现
// 复用 LR(1) 规范项目集，按 LR(0) 核心签名合并同心状态（向前看取并集）。
// 零 DOM 依赖，可独立单测。
// =============================================================================

// 复用 LR(1) 的文法/项目/构造工具
import {
  augment as lr1Augment,
  buildItemSets as lr1BuildItemSets,
  buildTable as lr1BuildTable,
  type Grammar,
  type Production,
  type ItemSet,
  type LR1Item,
  type ActionTable,
  type Lr1Hooks,
  type ParseResult,
} from '../lr1-parser/impl.ts';

export type LalrHooks = Lr1Hooks;

/** LR(0) 核心签名（忽略 lookahead 的项目集）。 */
function coreSignature(items: LR1Item[]): string {
  // 核心签名 = 去重后的 (prod, dot) 集合（忽略 lookahead，且去重）
  const core = new Set<string>();
  for (const it of items) core.add(`${it.prod}:${it.dot}`);
  return [...core].sort().join('|');
}

/** 合并同心状态：返回合并后的项目集与重映射。 */
export function mergeCoreStates(sets: ItemSet[]): {
  merged: ItemSet[];
  remap: Map<number, number>;
} {
  const coreToNewId = new Map<string, number>();
  const merged: ItemSet[] = [];
  const remap = new Map<number, number>(); // old id → new id

  // 用 Map<coreSig, Map<prod:dot, Set<lookahead>>> 累积
  const accum = new Map<string, Map<string, Set<string>>>();

  for (const s of sets) {
    const sig = coreSignature(s.items);
    if (!accum.has(sig)) {
      accum.set(sig, new Map());
      const newId = merged.length;
      coreToNewId.set(sig, newId);
      merged.push({ id: newId, items: [] });
    }
    const laMap = accum.get(sig)!;
    for (const it of s.items) {
      const k = `${it.prod}:${it.dot}`;
      if (!laMap.has(k)) laMap.set(k, new Set());
      laMap.get(k)!.add(it.la);
    }
    remap.set(s.id, coreToNewId.get(sig)!);
  }

  // 重建 items
  for (const state of merged) {
    // 找到这个新状态对应的核心
    const sig = [...coreToNewId.entries()].find(([, id]) => id === state.id)![0];
    const laMap = accum.get(sig)!;
    const items: LR1Item[] = [];
    for (const [k, las] of laMap) {
      const [prodStr, dotStr] = k.split(':');
      const prod = Number(prodStr);
      const dot = Number(dotStr);
      for (const la of las) items.push({ prod, dot, la });
    }
    items.sort((a, b) => a.prod - b.prod || a.dot - b.dot || (a.la < b.la ? -1 : 1));
    state.items = items;
  }

  return { merged, remap };
}

/** 构造 LALR(1) 项目集与转移（合并同心状态后重映射）。 */
export function buildLalrItemSets(g: Grammar): {
  sets: ItemSet[];
  transitions: Map<string, number>;
  originalCount: number;
} {
  const { sets: lr1Sets, transitions: lr1Trans } = lr1BuildItemSets(g);
  const originalCount = lr1Sets.length;
  const { merged, remap } = mergeCoreStates(lr1Sets);
  // 重映射转移
  const transitions = new Map<string, number>();
  for (const [k, to] of lr1Trans) {
    const [fromStr, sym] = k.split(',');
    const newFrom = remap.get(Number(fromStr))!;
    const newTo = remap.get(to)!;
    transitions.set(`${newFrom},${sym}`, newTo);
  }
  return { sets: merged, transitions, originalCount };
}

/** 构造 LALR(1) ACTION/GOTO 表。 */
export function buildLalrTable(g: Grammar): {
  sets: ItemSet[];
  table: ActionTable;
  originalCount: number;
} {
  const { sets, transitions, originalCount } = buildLalrItemSets(g);
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

  return { sets, table: { action, goto: gotoMap, conflicts }, originalCount };
}

/** LALR(1) 分析（用 LALR 表）。 */
export function lalrParse(input: string[], g: Grammar, hooks: LalrHooks = {}): ParseResult {
  const { table } = buildLalrTable(g);
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

export type { Grammar, Production };

/** 增广文法的便捷封装（转发到 LR(1) 的 augment）。 */
export function augment(
  productions: Production[],
  start: string,
  nonTerminals: Iterable<string>,
  terminals: Iterable<string>,
): Grammar {
  return lr1Augment(productions, start, nonTerminals, terminals);
}

// 示例文法：S → CC；C → cC | d（LALR 合并后状态数 = 7，少于 LR(1) 的 10）
export const SAMPLE_PRODUCTIONS: Production[] = [
  { lhs: 'S', rhs: ['C', 'C'] },
  { lhs: 'C', rhs: ['c', 'C'] },
  { lhs: 'C', rhs: ['d'] },
];

export function makeSampleGrammar(): Grammar {
  return lr1Augment(SAMPLE_PRODUCTIONS, 'S', ['S', 'C'], ['c', 'd']);
}

// 额外导出 LR(1) 表用于对比
export function buildLr1TableForComparison(g: Grammar): { count: number; conflicts: number } {
  const { sets, table } = lr1BuildTable(g);
  return { count: sets.length, conflicts: table.conflicts };
}
