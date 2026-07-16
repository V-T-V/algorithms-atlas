// =============================================================================
// 常量折叠 · 纯算法实现
// 对纯常量 AST 子树求值；不动点迭代。
// =============================================================================

export interface AstNode {
  type: string;
  value?: string | number | boolean;
  children?: AstNode[];
}

export interface FoldHooks {
  onFold?: (before: AstNode, after: AstNode, depth: number) => void;
  onPass?: (pass: number, foldCount: number) => void;
  onResult?: (root: AstNode, totalFolds: number, passes: number) => void;
}

/** 是否常量字面量节点。 */
function isLiteral(node: AstNode): boolean {
  return (
    (node.type === 'Num' || node.type === 'Bool' || node.type === 'Str') && node.value !== undefined
  );
}

function clone(node: AstNode): AstNode {
  return { type: node.type, value: node.value, children: node.children?.map(clone) };
}

/** 单遍自底向上折叠。 */
function foldOnce(root: AstNode, hooks: FoldHooks): { node: AstNode; folded: number } {
  let folded = 0;
  const go = (node: AstNode, depth: number): AstNode => {
    const newChildren = node.children?.map((c) => go(c, depth + 1)) ?? [];
    const node2: AstNode = { ...node, children: newChildren };
    if (
      node2.type === 'BinOp' &&
      newChildren.length === 2 &&
      isLiteral(newChildren[0]!) &&
      isLiteral(newChildren[1]!)
    ) {
      const v = evalBinop(String(node2.value), newChildren[0]!.value!, newChildren[1]!.value!);
      if (v !== undefined) {
        const foldedNode: AstNode = literalFromValue(v);
        folded++;
        hooks.onFold?.(node2, foldedNode, depth);
        return foldedNode;
      }
    }
    if (node2.type === 'UnaryOp' && newChildren.length === 1 && isLiteral(newChildren[0]!)) {
      const v = evalUnaryop(String(node2.value), newChildren[0]!.value!);
      if (v !== undefined) {
        const foldedNode: AstNode = literalFromValue(v);
        folded++;
        hooks.onFold?.(node2, foldedNode, depth);
        return foldedNode;
      }
    }
    return node2;
  };
  const node = go(root, 0);
  return { node, folded };
}

function evalBinop(op: string, a: unknown, b: unknown): unknown {
  if (op === '+') {
    if (typeof a === 'number' && typeof b === 'number') return a + b;
    if (typeof a === 'string' && typeof b === 'string') return a + b;
  }
  if (op === '-' && typeof a === 'number' && typeof b === 'number') return a - b;
  if (op === '*' && typeof a === 'number' && typeof b === 'number') return a * b;
  if (op === '/' && typeof a === 'number' && typeof b === 'number' && b !== 0) return a / b;
  if (op === '%') {
    if (typeof a === 'number' && typeof b === 'number' && b !== 0) return a % b;
  }
  if (op === '<') return lt(a, b);
  if (op === '>') return lt(b, a);
  if (op === '<=') return !lt(b, a);
  if (op === '>=') return !lt(a, b);
  if (op === '==') return a === b;
  if (op === '!=') return a !== b;
  if (op === 'and') return Boolean(a) && Boolean(b);
  if (op === 'or') return Boolean(a) || Boolean(b);
  return undefined;
}

function lt(a: unknown, b: unknown): boolean {
  if (typeof a === 'number' && typeof b === 'number') return a < b;
  if (typeof a === 'string' && typeof b === 'string') return a < b;
  return false;
}

function evalUnaryop(op: string, a: unknown): unknown {
  if (op === '-' && typeof a === 'number') return -a;
  if (op === 'not') return !a;
  return undefined;
}

function literalFromValue(v: unknown): AstNode {
  if (typeof v === 'number') return { type: 'Num', value: v };
  if (typeof v === 'boolean') return { type: 'Bool', value: v };
  if (typeof v === 'string') return { type: 'Str', value: v };
  return { type: 'Num', value: 0 };
}

/**
 * 不动点常量折叠。
 *
 * @param root AST 根
 * @param maxPasses 最大轮数
 * @param hooks 可选钩子
 */
export function constantFold(
  root: AstNode,
  maxPasses = 20,
  hooks: FoldHooks = {},
): { root: AstNode; totalFolds: number; passes: number } {
  let cur = clone(root);
  let totalFolds = 0;
  let passes = 0;
  for (let p = 1; p <= maxPasses; p++) {
    const r = foldOnce(cur, hooks);
    passes = p;
    hooks.onPass?.(p, r.folded);
    if (r.folded === 0) break;
    totalFolds += r.folded;
    cur = r.node;
  }
  hooks.onResult?.(cur, totalFolds, passes);
  return { root: cur, totalFolds, passes };
}

/** 节点数（用于报告折叠幅度）。 */
export function nodeCount(node: AstNode): number {
  let n = 1;
  for (const c of node.children ?? []) n += nodeCount(c);
  return n;
}
