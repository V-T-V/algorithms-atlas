// =============================================================================
// 递归下降解析（Recursive Descent）· 纯算法实现
// 解析四则运算中缀表达式（+ - * / 括号），生成 AST。零 DOM 依赖，可独立单测。
// 文法（左递归已消除）：
//   expr   → term (('+' | '-') term)*
//   term   → factor (('*' | '/') factor)*
//   factor → number | '(' expr ')'
// =============================================================================

import type { TreeNode } from '../../../types.ts';

export type { TreeNode };

/** 算法执行过程中的事件钩子。任一可选。 */
export interface RecursiveDescentHooks {
  /** 进入某条产生式规则。 */
  onEnter?: (rule: string) => void;
  /** 匹配并消费一个 token。 */
  onMatch?: (token: string, pos: number) => void;
  /** 生成一个 AST 节点。 */
  onNode?: (rule: string, node: TreeNode) => void;
  /** 解析完成，输出根节点。 */
  onResult?: (root: TreeNode) => void;
}

/** 简易分词：把中缀字符串切成 token 数组（支持多位数、小数与运算符）。 */
export function tokenize(expr: string): string[] {
  const tokens: string[] = [];
  const re = / s*([()+\-*/]| d+(?:\. d+)?) s*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(expr)) !== null) {
    tokens.push(m[1]!);
  }
  return tokens;
}

/** 生成唯一节点 id。 */
let nodeIdCounter = 0;
function nextId(): string {
  return `n${nodeIdCounter++}`;
}

/** 重置节点 id 计数器（测试可复现）。 */
export function resetNodeId(): void {
  nodeIdCounter = 0;
}

/**
 * 递归下降解析器：把中缀表达式 token 数组解析为 AST。
 * 支持 + - * / 与圆括号，处理运算符优先级（乘除高于加减）。
 *
 * @param tokens 中缀表达式（已分词）
 * @param hooks 可选事件钩子
 * @returns AST 根节点
 */
export function recursiveDescent(
  tokens: readonly string[],
  hooks: RecursiveDescentHooks = {},
): TreeNode {
  resetNodeId();
  let pos = 0;

  const peek = (): string | undefined => tokens[pos];
  const consume = (): string => {
    const t = tokens[pos]!;
    hooks.onMatch?.(t, pos);
    pos++;
    return t;
  };

  // expr → term (('+' | '-') term)*
  const parseExpr = (): TreeNode => {
    hooks.onEnter?.('expr');
    let node = parseTerm();
    while (peek() === '+' || peek() === '-') {
      const op = consume();
      const right = parseTerm();
      node = {
        id: nextId(),
        value: op,
        role: 'pivot',
        children: [node, right],
      };
      hooks.onNode?.('expr', node);
    }
    return node;
  };

  // term → factor (('*' | '/') factor)*
  const parseTerm = (): TreeNode => {
    hooks.onEnter?.('term');
    let node = parseFactor();
    while (peek() === '*' || peek() === '/') {
      const op = consume();
      const right = parseFactor();
      node = {
        id: nextId(),
        value: op,
        role: 'pivot',
        children: [node, right],
      };
      hooks.onNode?.('term', node);
    }
    return node;
  };

  // factor → number | '(' expr ')'
  const parseFactor = (): TreeNode => {
    hooks.onEnter?.('factor');
    const t = peek();
    if (t === '(') {
      consume(); // (
      const node = parseExpr();
      if (peek() === ')') consume(); // )
      return node;
    }
    // 数字
    const num = consume();
    const node: TreeNode = { id: nextId(), value: num, role: 'default' };
    hooks.onNode?.('factor', node);
    return node;
  };

  const root = parseExpr();
  hooks.onResult?.(root);
  return root;
}

/** 对 AST 求值（辅助：验证解析正确性）。 */
export function evalAst(root: TreeNode): number {
  const v = root.value;
  if (!root.children || root.children.length === 0) {
    return parseFloat(String(v));
  }
  const a = evalAst(root.children[0]!);
  const b = evalAst(root.children[1]!);
  switch (v) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return a / b;
    default:
      throw new Error(`未知运算符 / unknown operator: ${v}`);
  }
}

/** 便捷：解析字符串表达式为 AST。 */
export function parseExpr(expr: string, hooks: RecursiveDescentHooks = {}): TreeNode {
  return recursiveDescent(tokenize(expr), hooks);
}
