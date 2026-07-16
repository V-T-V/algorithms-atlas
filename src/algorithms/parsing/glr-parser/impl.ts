// =============================================================================
// 广义 LR（GLR）解析 · 纯算法实现
// 用 Tomita 风格的「图结构栈」（graph-structured stack）解析可能歧义的文法。
// 自动机构造用 LR(0) 项目集；动作表对每个状态列出所有合法的移进/归约
// （允许多个 → 自然产生分裂）。本实现面向教学，文法用规则数组显式给出。
// 零 DOM 依赖，可独立单测。
// =============================================================================

import type { TreeNode } from '../../../types.ts';

export type { TreeNode };

/** 文法符号：终结符（字符串）或非终结符（大写名）。 */
export type Symbol = string; // 终结符 = 终结符字面量；非终结符 = 规则名

/** 一条产生式规则 A → β。 */
export interface Rule {
  /** 左部非终结符。 */
  lhs: string;
  /** 右部符号序列。 */
  rhs: Symbol[];
}

/** LR(0) 项目：规则 + 圆点位置。 */
export interface Item {
  ruleIndex: number;
  dot: number;
}

/** LR(0) 项目集（一个自动机状态）。 */
export type ItemSet = Item[];

/** LR(0) 自动机：状态列表 + goto 表。 */
export interface Automaton {
  states: ItemSet[];
  /** goto[stateIndex][symbol] = 目标 stateIndex。 */
  goto: Map<string, number>[];
}

/** 解析时一个栈头：栈顶节点指针（在 GSS 中）。 */
export interface StackHead {
  /** GSS 节点 id。 */
  nodeId: number;
}

/** GSS 节点：状态 + 一组前驱边（指向更深的节点）。 */
export interface GssNode {
  id: number;
  state: number;
  /** 前驱节点 id（栈更深方向）。 */
  preds: number[];
  /** 若本节点由归约创建，记录对应的规则与被归约的非终结符。 */
  label?: { symbol?: string; rule?: Rule };
}

export interface GlrHooks {
  /** 每个输入位置开始时调用：当前 token、活跃栈头数。 */
  onToken?: (pos: number, token: string, numHeads: number) => void;
  /** 发生移进。 */
  onShift?: (pos: number, token: string, fromState: number, toState: number) => void;
  /** 发生归约。 */
  onReduce?: (pos: number, rule: Rule, state: number) => void;
  /** 栈头分裂。 */
  onSplit?: (pos: number, numHeads: number) => void;
  /** 解析结束。 */
  onResult?: (accepted: boolean, numTrees: number) => void;
}

// ---------------------------------------------------------------------------
// LR(0) 自动机构造
// ---------------------------------------------------------------------------

/** 计算项目集 I 的闭包。 */
function closure(items: ItemSet, rules: Rule[]): ItemSet {
  const set: ItemSet = items.map((it) => ({ ...it }));
  const keyOf = (it: Item): string => `${it.ruleIndex}.${it.dot}`;
  const seen = new Set(set.map(keyOf));
  let changed = true;
  while (changed) {
    changed = false;
    for (const it of set) {
      const rule = rules[it.ruleIndex]!;
      if (it.dot >= rule.rhs.length) continue;
      const B = rule.rhs[it.dot]!;
      // 若 B 是非终结符（即某规则的 lhs），加入 B → ·γ
      for (let ri = 0; ri < rules.length; ri++) {
        if (rules[ri]!.lhs === B) {
          const newItem: Item = { ruleIndex: ri, dot: 0 };
          if (!seen.has(keyOf(newItem))) {
            seen.add(keyOf(newItem));
            set.push(newItem);
            changed = true;
          }
        }
      }
    }
  }
  // 稳定排序便于状态去重
  set.sort((a, b) => (a.ruleIndex !== b.ruleIndex ? a.ruleIndex - b.ruleIndex : a.dot - b.dot));
  return set;
}

/** 计算 I 在符号 X 上的 goto（圆点前进一步再闭包）。 */
function gotoSet(items: ItemSet, X: Symbol, rules: Rule[]): ItemSet {
  const moved: ItemSet = [];
  for (const it of items) {
    const rule = rules[it.ruleIndex]!;
    if (it.dot < rule.rhs.length && rule.rhs[it.dot] === X) {
      moved.push({ ruleIndex: it.ruleIndex, dot: it.dot + 1 });
    }
  }
  return closure(moved, rules);
}

/** 状态的规范化键。 */
function stateKey(items: ItemSet): string {
  return items.map((it) => `${it.ruleIndex}.${it.dot}`).join('|');
}

/** 构造 LR(0) 自动机。 */
export function buildAutomaton(rules: Rule[], startLhs: string): Automaton {
  // 起始项目：startLhs → ·α
  const startItems: ItemSet = [];
  for (let ri = 0; ri < rules.length; ri++) {
    if (rules[ri]!.lhs === startLhs) startItems.push({ ruleIndex: ri, dot: 0 });
  }
  const s0 = closure(startItems, rules);
  const states: ItemSet[] = [s0];
  const stateKeys = new Map<string, number>([[stateKey(s0), 0]]);
  const gotoMaps: Map<string, number>[] = [new Map()];

  let qi = 0;
  while (qi < states.length) {
    const I = states[qi]!;
    const symbolsAfterDot = new Set<Symbol>();
    for (const it of I) {
      const rule = rules[it.ruleIndex]!;
      if (it.dot < rule.rhs.length) symbolsAfterDot.add(rule.rhs[it.dot]!);
    }
    for (const X of symbolsAfterDot) {
      const J = gotoSet(I, X, rules);
      const k = stateKey(J);
      let jIndex = stateKeys.get(k);
      if (jIndex === undefined) {
        states.push(J);
        stateKeys.set(k, states.length - 1);
        gotoMaps.push(new Map());
        jIndex = states.length - 1;
      }
      gotoMaps[qi]!.set(X, jIndex);
    }
    qi++;
  }
  return { states, goto: gotoMaps };
}

// ---------------------------------------------------------------------------
// GLR 解析主循环（Tomita 风格，简化版：不完整做前驱链合并，仅按状态去重栈头）
// ---------------------------------------------------------------------------

export interface GlrResult {
  accepted: boolean;
  /** 找到的归约序列数量（每条对应一个解析）。 */
  numTrees: number;
}

/**
 * GLR 解析。文法用规则数组给出；tokens 为终结符序列。
 * 接受条件：输入耗尽且某栈头处于「接受状态」（即含 S' → S· 归约项，这里以 start 规则归约判定）。
 */
export function glrParse(
  tokens: readonly string[],
  rules: Rule[],
  startLhs: string,
  hooks: GlrHooks = {},
): GlrResult {
  // 增广文法：加入 S' → startLhs（唯一的新起始规则），用于判定接受。
  const START_PRIME = `${startLhs}'`;
  const augRules: Rule[] = [{ lhs: START_PRIME, rhs: [startLhs] }, ...rules];
  const acceptRuleIndex = 0; // S' → startLhs ·

  const auto = buildAutomaton(augRules, START_PRIME);

  // GSS
  const nodes: GssNode[] = [];
  const makeNode = (
    state: number,
    preds: number[],
    label?: { symbol?: string; rule?: Rule },
  ): number => {
    const id = nodes.length;
    nodes.push({ id, state, preds: [...preds], label });
    return id;
  };

  let acceptCount = 0;

  // 移进：对每个栈头，若 goto[token] 存在，创建新节点；同状态合并前驱。
  const doShift = (headNodes: number[], token: string, pos: number): number[] => {
    const newHeads: number[] = [];
    const byState = new Map<number, number>();
    for (const h of headNodes) {
      const state = nodes[h]!.state;
      const target = auto.goto[state]!.get(token);
      if (target === undefined) continue;
      hooks.onShift?.(pos, token, state, target);
      const existing = byState.get(target);
      if (existing === undefined) {
        const nid = makeNode(target, [h], { symbol: token });
        byState.set(target, nid);
        newHeads.push(nid);
      } else {
        nodes[existing]!.preds.push(h);
      }
    }
    return newHeads;
  };

  // 归约：worklist 算法。对每个待处理栈头，找出其状态的所有归约项，
  // 执行归约产生新栈头（合并同状态），并把新栈头加入待处理集合。
  // 原栈头保留在结果中（除非被接受规则消费）。
  const doReduces = (initial: number[], pos: number): number[] => {
    // 结果集合（按 state 去重，保存 node id）
    const result = new Map<number, number>();
    const addHead = (nodeId: number): void => {
      const st = nodes[nodeId]!.state;
      const existing = result.get(st);
      if (existing === undefined) {
        result.set(st, nodeId);
      } else {
        // 合并：把 nodeId 的前驱并入 existing（这里前驱在创建时已定，仅作标记）
        // 实际上前驱合并已在创建处处理；此处仅去重保留。
      }
    };

    // 待处理队列（去重）
    const pending: number[] = [];
    const inPending = new Set<number>();
    const enqueue = (nodeId: number): void => {
      if (!inPending.has(nodeId)) {
        inPending.add(nodeId);
        pending.push(nodeId);
      }
    };
    for (const h of initial) enqueue(h);

    while (pending.length > 0) {
      const h = pending.shift()!;
      inPending.delete(h);
      const state = nodes[h]!.state;
      const items = auto.states[state]!;
      const reduceItems = items.filter((it) => {
        const rule = augRules[it.ruleIndex]!;
        return it.dot >= rule.rhs.length;
      });
      // 无归约项 → 保留该栈头
      if (reduceItems.length === 0) {
        addHead(h);
        continue;
      }
      let producedNew = false;
      for (const it of reduceItems) {
        const rule = augRules[it.ruleIndex]!;
        hooks.onReduce?.(pos, rule, state);
        // 接受规则 S' → startLhs：仅当输入耗尽时计为成功接受
        if (it.ruleIndex === acceptRuleIndex) {
          if (pos === tokens.length) acceptCount++;
          continue; // 接受规则不压回栈
        }
        // 沿前驱回退 |β| 步
        const popLen = rule.rhs.length;
        let layer = [h];
        for (let step = 0; step < popLen; step++) {
          const nextLayer: number[] = [];
          for (const ln of layer) {
            for (const p of nodes[ln]!.preds) nextLayer.push(p);
          }
          layer = nextLayer;
        }
        for (const base of layer) {
          const baseState = nodes[base]!.state;
          const target = auto.goto[baseState]!.get(rule.lhs);
          if (target === undefined) continue;
          const existing = result.get(target);
          if (existing === undefined) {
            const nid = makeNode(target, [base], { symbol: rule.lhs, rule });
            result.set(target, nid);
            enqueue(nid);
            producedNew = true;
          } else {
            // 合并前驱
            if (!nodes[existing]!.preds.includes(base)) {
              nodes[existing]!.preds.push(base);
            }
          }
        }
      }
      // 若该栈头产生了新归约但也可能有移进动作，原始栈头仍保留（GLR：归约不消除移进可能性）
      // 这里只要状态还可移进当前 token 就保留——但 doReduces 在移进前调用，保留原 head 让 doShift 处理。
      addHead(h);
      void producedNew;
    }
    return [...result.values()];
  };

  // 主循环
  let heads: number[] = [makeNode(0, [])];
  for (let pos = 0; pos < tokens.length; pos++) {
    const token = tokens[pos]!;
    hooks.onToken?.(pos, token, heads.length);
    heads = doReduces(heads, pos);
    if (heads.length > 1) hooks.onSplit?.(pos, heads.length);
    heads = doShift(heads, token, pos);
    if (heads.length === 0) break;
  }
  // 末尾归约：触发接受规则
  if (heads.length > 0) {
    heads = doReduces(heads, tokens.length);
  }

  const accepted = acceptCount > 0;
  hooks.onResult?.(accepted, acceptCount);
  return { accepted, numTrees: acceptCount };
}

// ---------------------------------------------------------------------------
// 演示文法：歧义表达式（无优先级/结合性声明 → GLR 自然产生多棵解析树）
//   E → E + E | E * E | n
// 输入 "n + n * n" 应被接受，且对应多种结合解释。
// ---------------------------------------------------------------------------
export function demoGrammar(): { rules: Rule[]; startLhs: string } {
  const rules: Rule[] = [
    { lhs: 'E', rhs: ['E', '+', 'E'] },
    { lhs: 'E', rhs: ['E', '*', 'E'] },
    { lhs: 'E', rhs: ['n'] },
  ];
  return { rules, startLhs: 'E' };
}

export const DEMO_TOKENS = ['n', '+', 'n', '*', 'n'];

/** 简单分词（演示用：把数字串归一为 'n'，运算符 + * 原样）。 */
export function tokenizeExpr(input: string): string[] {
  const out: string[] = [];
  const re = / s*( d+|[+*]) s*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(input)) !== null) {
    out.push(/ d/.test(m[1]!) ? 'n' : m[1]!);
  }
  return out;
}
