// 表达式树（后缀式）· 纯算法实现

export interface ExprLeaf {
  type: 'leaf';
  value: number;
}
export interface ExprInternal {
  type: 'internal';
  op: string;
  left: ExprTreeNode;
  right: ExprTreeNode;
}
export type ExprTreeNode = ExprLeaf | ExprInternal;

/** 事件钩子。 */
export interface ExprTreeHooks {
  /** 压入一个操作数叶子。 */
  onPushLeaf?: (value: number) => void;
  /** 弹出两节点构造内部节点。 */
  onReduce?: (op: string, stackSize: number) => void;
  /** 完成。 */
  onResult?: (root: ExprTreeNode) => void;
}

/**
 * 从后缀 token 序列构建表达式树。
 *
 * @param tokens 后缀 token（数字字符串或算符字符串）
 * @param hooks 可选事件钩子
 * @returns 表达式树根
 */
export function buildExpressionTree(
  tokens: readonly string[],
  hooks: ExprTreeHooks = {},
): ExprTreeNode {
  const OPS = new Set(['+', '-', '*', '/', '^']);
  const stack: ExprTreeNode[] = [];

  for (const tk of tokens) {
    if (OPS.has(tk)) {
      if (stack.length < 2) throw new Error(`算符 ${tk} 缺操作数`);
      const right = stack.pop()!;
      const left = stack.pop()!;
      const node: ExprInternal = { type: 'internal', op: tk, left, right };
      stack.push(node);
      hooks.onReduce?.(tk, stack.length);
    } else {
      const v = parseFloat(tk);
      if (Number.isNaN(v)) throw new Error(`非法 token: ${tk}`);
      const leaf: ExprLeaf = { type: 'leaf', value: v };
      stack.push(leaf);
      hooks.onPushLeaf?.(v);
    }
  }
  if (stack.length !== 1) throw new Error(`表达式不完整，栈剩 ${stack.length}`);
  const root = stack[0]!;
  hooks.onResult?.(root);
  return root;
}

/** 后序求值。 */
export function evalExprTree(node: ExprTreeNode): number {
  if (node.type === 'leaf') return node.value;
  const l = evalExprTree(node.left);
  const r = evalExprTree(node.right);
  switch (node.op) {
    case '+':
      return l + r;
    case '-':
      return l - r;
    case '*':
      return l * r;
    case '/':
      return l / r;
    case '^':
      return Math.pow(l, r);
    default:
      throw new Error(`未知算符 ${node.op}`);
  }
}

/** 中序还原（带括号）。 */
export function exprTreeToInfix(node: ExprTreeNode): string {
  if (node.type === 'leaf') return String(node.value);
  return `(${exprTreeToInfix(node.left)} ${node.op} ${exprTreeToInfix(node.right)})`;
}

/** 把中缀表达式（含 + − * / 与括号）转为后缀（调度场算法）。 */
export function infixToPostfix(infix: string): string[] {
  const out: string[] = [];
  const opStack: string[] = [];
  const prec: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };
  let i = 0;
  while (i < infix.length) {
    const c = infix[i]!;
    if (c === ' ') {
      i++;
      continue;
    }
    if (/[0-9]/.test(c)) {
      let j = i;
      while (j < infix.length && /[0-9.]/.test(infix[j]!)) j++;
      out.push(infix.slice(i, j));
      i = j;
    } else if (c in prec) {
      while (
        opStack.length > 0 &&
        opStack[opStack.length - 1] !== '(' &&
        (prec[opStack[opStack.length - 1]!]! > prec[c]! ||
          (prec[opStack[opStack.length - 1]!]! === prec[c]! && c !== '^'))
      ) {
        out.push(opStack.pop()!);
      }
      opStack.push(c);
      i++;
    } else if (c === '(') {
      opStack.push(c);
      i++;
    } else if (c === ')') {
      while (opStack.length > 0 && opStack[opStack.length - 1] !== '(') {
        out.push(opStack.pop()!);
      }
      opStack.pop(); // 弹出 (
      i++;
    } else {
      throw new Error(`非法字符: ${c}`);
    }
  }
  while (opStack.length > 0) out.push(opStack.pop()!);
  return out;
}
