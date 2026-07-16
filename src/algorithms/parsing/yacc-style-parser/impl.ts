// =============================================================================
// Yacc 风格解析器（动作表驱动 + 语义动作）· 纯算法实现
// 显式给出 LALR(1) 风格的 ACTION/GOTO 表，做经典移进-归约；
// 每条归约规则挂语义动作（接收 $1..$k 值、返回 $$）。
// 文法（无歧义，已内建优先级）：
//   0: E → E + T   { $$ = $1 + $3 }
//   1: E → E - T   { $$ = $1 - $3 }
//   2: E → T       { $$ = $1 }
//   3: T → T * F   { $$ = $1 * $3 }
//   4: T → T / F   { $$ = $1 / $3 }
//   5: T → F       { $$ = $1 }
//   6: F → ( E )   { $$ = $2 }
//   7: F → NUM     { $$ = $1 }
// 零 DOM 依赖，可独立单测。
// =============================================================================

import type { TreeNode } from '../../../types.ts';

export type { TreeNode };

/** 动作类型：移进到状态 s / 用规则 r 归约 / 接受 / 错误。 */
export type Action =
  | { type: 'shift'; state: number }
  | { type: 'reduce'; rule: number }
  | { type: 'accept' }
  | { type: 'error' };

/** 终结符集合。 */
export const TERMINALS = ['NUM', '+', '-', '*', '/', '(', ')', '$'];

/** 非终结符集合。 */
export const NONTERMINALS = ['E', 'T', 'F'];

/** 规则左部与右部长度。 */
export interface RuleDef {
  lhs: string;
  /** 右部符号数（用于确定弹出层数）。 */
  rhsLen: number;
  /** 可读的产生式（展示用）。 */
  display: string;
}

export const RULES: RuleDef[] = [
  { lhs: 'E', rhsLen: 3, display: 'E → E + T' },
  { lhs: 'E', rhsLen: 3, display: 'E → E - T' },
  { lhs: 'E', rhsLen: 1, display: 'E → T' },
  { lhs: 'T', rhsLen: 3, display: 'T → T * F' },
  { lhs: 'T', rhsLen: 3, display: 'T → T / F' },
  { lhs: 'T', rhsLen: 1, display: 'T → F' },
  { lhs: 'F', rhsLen: 3, display: 'F → ( E )' },
  { lhs: 'F', rhsLen: 1, display: 'F → NUM' },
];

/**
 * 语义动作：输入归约栈顶的值（$1..$k，按规则 rhsLen 个），
 * 返回归约后的 $$ 值。
 */
export type SemanticAction = (values: number[]) => number;

export const ACTIONS: SemanticAction[] = [
  (v) => v[0]! + v[2]!, // E → E + T
  (v) => v[0]! - v[2]!, // E → E - T
  (v) => v[0]!, // E → T
  (v) => v[0]! * v[2]!, // T → T * F
  (v) => v[0]! / v[2]!, // T → T / F
  (v) => v[0]!, // T → F
  (v) => v[1]!, // F → ( E )
  (v) => v[0]!, // F → NUM
];

// ---------------------------------------------------------------------------
// SLR(1) ACTION / GOTO 表（由 LR(0) 自动机 + FOLLOW 集算法生成，无冲突）
// 终结符列序 = TERMINALS：NUM + - * / ( ) $
// 非终结符列序 = NONTERMINALS：E T F
// 共 16 个状态。
// ---------------------------------------------------------------------------

const S = (state: number): Action => ({ type: 'shift', state });
const R = (rule: number): Action => ({ type: 'reduce', rule });
const ACC: Action = { type: 'accept' };
const ERR: Action = { type: 'error' };

/** ACTION[state][terminalIndex]，列序 = TERMINALS。 */
export const ACTION_TABLE: Action[][] = [
  [S(5), ERR, ERR, ERR, ERR, S(4), ERR, ERR], // S0
  [ERR, S(6), S(7), ERR, ERR, ERR, ERR, ACC], // S1
  [ERR, R(2), R(2), S(8), S(9), ERR, R(2), R(2)], // S2
  [ERR, R(5), R(5), R(5), R(5), ERR, R(5), R(5)], // S3
  [S(5), ERR, ERR, ERR, ERR, S(4), ERR, ERR], // S4
  [ERR, R(7), R(7), R(7), R(7), ERR, R(7), R(7)], // S5
  [S(5), ERR, ERR, ERR, ERR, S(4), ERR, ERR], // S6
  [S(5), ERR, ERR, ERR, ERR, S(4), ERR, ERR], // S7
  [S(5), ERR, ERR, ERR, ERR, S(4), ERR, ERR], // S8
  [S(5), ERR, ERR, ERR, ERR, S(4), ERR, ERR], // S9
  [ERR, S(6), S(7), ERR, ERR, ERR, S(15), ERR], // S10
  [ERR, R(0), R(0), S(8), S(9), ERR, R(0), R(0)], // S11
  [ERR, R(1), R(1), S(8), S(9), ERR, R(1), R(1)], // S12
  [ERR, R(3), R(3), R(3), R(3), ERR, R(3), R(3)], // S13
  [ERR, R(4), R(4), R(4), R(4), ERR, R(4), R(4)], // S14
  [ERR, R(6), R(6), R(6), R(6), ERR, R(6), R(6)], // S15
];

/** GOTO[state][nonterminalIndex]，列序 = NONTERMINALS。 */
export const GOTO_TABLE: number[][] = [
  [1, 2, 3], // S0
  [-1, -1, -1], // S1
  [-1, -1, -1], // S2
  [-1, -1, -1], // S3
  [10, 2, 3], // S4
  [-1, -1, -1], // S5
  [-1, 11, 3], // S6
  [-1, 12, 3], // S7
  [-1, -1, 13], // S8
  [-1, -1, 14], // S9
  [-1, -1, -1], // S10
  [-1, -1, -1], // S11
  [-1, -1, -1], // S12
  [-1, -1, -1], // S13
  [-1, -1, -1], // S14
  [-1, -1, -1], // S15
];

export interface YaccHooks {
  /** 读入一个 token。 */
  onShift?: (token: string, value: number, state: number) => void;
  /** 执行归约：规则、输入值、输出 $$。 */
  onReduce?: (rule: number, display: string, values: number[], result: number) => void;
  /** 解析完成。 */
  onResult?: (accepted: boolean, value: number) => void;
  /** 错误。 */
  onError?: (token: string, state: number) => void;
}

export interface YaccResult {
  accepted: boolean;
  value: number;
  /** 已消费的 token 数（错误时定位用）。 */
  consumed: number;
}

/** 简单分词：数字 → {NUM, 值}，运算符原样。 */
export function tokenize(src: string): Array<{ kind: string; value: number; text: string }> {
  const out: Array<{ kind: string; value: number; text: string }> = [];
  const re = / s*(?:( d+(?:\. d+)?)|([+\-*/()]))/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    if (m[1] !== undefined) {
      out.push({ kind: 'NUM', value: parseFloat(m[1]!), text: m[1]! });
    } else {
      out.push({ kind: m[2]!, value: 0, text: m[2]! });
    }
  }
  out.push({ kind: '$', value: 0, text: '$' });
  return out;
}

const termIndex = (kind: string): number => TERMINALS.indexOf(kind);
const ntIndex = (nt: string): number => NONTERMINALS.indexOf(nt);

/**
 * Yacc 风格移进-归约解析。
 * @param tokens 已分词（含结尾 $）
 * @returns 解析结果（含语义计算值）
 */
export function yaccParse(
  tokens: ReadonlyArray<{ kind: string; value: number; text: string }>,
  hooks: YaccHooks = {},
): YaccResult {
  const stateStack: number[] = [0];
  const valueStack: number[] = [0];
  let pos = 0;
  let result = 0;

  while (pos < tokens.length) {
    const token = tokens[pos]!;
    const state = stateStack[stateStack.length - 1]!;
    const ti = termIndex(token.kind);
    if (ti < 0) {
      hooks.onError?.(token.text, state);
      return { accepted: false, value: 0, consumed: pos };
    }
    const action = ACTION_TABLE[state]![ti]!;

    if (action.type === 'shift') {
      hooks.onShift?.(token.text, token.value, action.state);
      stateStack.push(action.state);
      valueStack.push(token.value);
      pos++;
    } else if (action.type === 'reduce') {
      const rule = action.rule;
      const def = RULES[rule]!;
      const popped: number[] = [];
      for (let i = 0; i < def.rhsLen; i++) {
        stateStack.pop();
        popped.unshift(valueStack.pop()!);
      }
      const newVal = ACTIONS[rule]!(popped);
      hooks.onReduce?.(rule, def.display, popped, newVal);
      const topState = stateStack[stateStack.length - 1]!;
      const gi = ntIndex(def.lhs);
      const gotoState = GOTO_TABLE[topState]![gi]!;
      if (gotoState < 0) {
        hooks.onError?.(token.text, topState);
        return { accepted: false, value: 0, consumed: pos };
      }
      stateStack.push(gotoState);
      valueStack.push(newVal);
    } else if (action.type === 'accept') {
      result = valueStack[valueStack.length - 1]!;
      hooks.onResult?.(true, result);
      return { accepted: true, value: result, consumed: pos };
    } else {
      // error
      hooks.onError?.(token.text, state);
      return { accepted: false, value: 0, consumed: pos };
    }
  }

  hooks.onResult?.(false, 0);
  return { accepted: false, value: 0, consumed: pos };
}

/** 便捷：解析字符串并求值。 */
export function evalExpr(src: string): number {
  return yaccParse(tokenize(src)).value;
}

// ---------------------------------------------------------------------------
// 构造 AST（用于 trace 可视化）：归约时构造节点。
// ---------------------------------------------------------------------------

export interface AstResult {
  accepted: boolean;
  ast: TreeNode | null;
}

let astCounter = 0;
export function resetAstCounter(): void {
  astCounter = 0;
}

/** 解析并构造 AST（每个归约创建一个节点）。 */
export function yaccParseAst(
  tokens: ReadonlyArray<{ kind: string; value: number; text: string }>,
): AstResult {
  resetAstCounter();
  const stateStack: number[] = [0];
  const nodeStack: TreeNode[] = [];
  let pos = 0;

  const makeNode = (value: string | number, children: TreeNode[]): TreeNode => ({
    id: `a${astCounter++}`,
    value,
    role: children.length > 0 ? 'pivot' : 'default',
    children: children.length > 0 ? children : undefined,
  });

  while (pos < tokens.length) {
    const token = tokens[pos]!;
    const state = stateStack[stateStack.length - 1]!;
    const ti = termIndex(token.kind);
    if (ti < 0) return { accepted: false, ast: null };
    const action = ACTION_TABLE[state]![ti]!;
    if (action.type === 'shift') {
      stateStack.push(action.state);
      nodeStack.push(makeNode(token.text, []));
      pos++;
    } else if (action.type === 'reduce') {
      const def = RULES[action.rule]!;
      const popped: TreeNode[] = [];
      for (let i = 0; i < def.rhsLen; i++) {
        stateStack.pop();
        popped.unshift(nodeStack.pop()!);
      }
      // 节点值：运算符规则用运算符，单值规则取子节点值
      let nodeVal: string | number = def.lhs;
      if (def.rhsLen === 3) {
        // 取中间符号（运算符或括号内 E）
        nodeVal = popped[1]!.value;
      } else if (def.rhsLen === 1) {
        nodeVal = popped[0]!.value;
      }
      const node = makeNode(nodeVal, popped);
      const topState = stateStack[stateStack.length - 1]!;
      const gi = ntIndex(def.lhs);
      const gotoState = GOTO_TABLE[topState]![gi]!;
      if (gotoState < 0) return { accepted: false, ast: null };
      stateStack.push(gotoState);
      nodeStack.push(node);
    } else if (action.type === 'accept') {
      return { accepted: true, ast: nodeStack[nodeStack.length - 1] ?? null };
    } else {
      return { accepted: false, ast: null };
    }
  }
  return { accepted: false, ast: null };
}

export const DEMO_SOURCE = '3 + 4 * 2';
