// =============================================================================
// AST 变换器 · 纯算法实现
// 通用 transform(node, rewrite) 自底向上重写；内置算术折叠 + 单位元消除。
// =============================================================================

export interface AstNode {
  type: string;
  value?: string | number;
  children?: AstNode[];
}

export interface RewriteHooks {
  onRewrite?: (before: AstNode, after: AstNode, depth: number) => void;
  onResult?: (root: AstNode, rewriteCount: number) => void;
}

/** 深拷贝节点（不可变变换所需）。 */
function clone(node: AstNode): AstNode {
  return {
    type: node.type,
    value: node.value,
    children: node.children?.map(clone),
  };
}

/**
 * 通用自底向上变换。
 *
 * @param root 原始 AST 根
 * @param rewrite 给定（原节点, 已变换的子节点数组），返回新节点；若返回 undefined 表示保留变换后的子节点构造（不变换本节点结构）
 * @param hooks 可选钩子
 * @param maxPasses 不动点迭代次数（默认 1，即单遍）
 */
export function transform(
  root: AstNode,
  rewrite: (node: AstNode, children: AstNode[]) => AstNode,
  hooks: RewriteHooks = {},
  maxPasses = 1,
): { root: AstNode; rewrites: number } {
  let cur = clone(root);
  let rewrites = 0;
  for (let pass = 0; pass < maxPasses; pass++) {
    let changedThisPass = false;
    const go = (node: AstNode, depth: number): AstNode => {
      const newChildren = node.children?.map((c) => go(c, depth + 1)) ?? [];
      const before = node;
      const nodeWithNewChildren: AstNode = { ...node, children: newChildren };
      const after = rewrite(nodeWithNewChildren, newChildren);
      if (!sameTree(before, after)) {
        rewrites++;
        changedThisPass = true;
        hooks.onRewrite?.(before, after, depth);
      }
      return after;
    };
    cur = go(cur, 0);
    if (!changedThisPass) break;
  }
  hooks.onResult?.(cur, rewrites);
  return { root: cur, rewrites };
}

/** 简单结构相等（用于检测是否变化）。 */
export function sameTree(a: AstNode, b: AstNode): boolean {
  if (a.type !== b.type) return false;
  if (a.value !== b.value) return false;
  const ac = a.children ?? [];
  const bc = b.children ?? [];
  if (ac.length !== bc.length) return false;
  return ac.every((c, i) => sameTree(c, bc[i]!));
}

// —— 内置重写器：算术常量折叠 + 单位元消除 ——

function isNum(n: AstNode): n is AstNode & { value: number } {
  return n.type === 'Num' && typeof n.value === 'number';
}

/**
 * 算术重写：
 *   - BinOp 两侧都是 Num → 折叠成 Num
 *   - BinOp(+)  x + 0 / 0 + x → x
 *   - BinOp(*)  x * 1 / 1 * x → x；x * 0 / 0 * x → Num 0
 */
export function arithmeticRewrite(node: AstNode, children: AstNode[]): AstNode {
  if (node.type !== 'BinOp' || children.length !== 2) return node;
  const op = String(node.value);
  const [l, r] = children as [AstNode, AstNode];

  // 常量折叠
  if (isNum(l) && isNum(r)) {
    const a = l.value;
    const b = r.value;
    let v: number | undefined;
    if (op === '+') v = a + b;
    else if (op === '-') v = a - b;
    else if (op === '*') v = a * b;
    else if (op === '/') v = b === 0 ? undefined : a / b;
    if (v !== undefined) return { type: 'Num', value: v };
  }

  // 单位元 / 零元
  if (op === '+') {
    if (isNum(r) && r.value === 0) return l;
    if (isNum(l) && l.value === 0) return r;
  }
  if (op === '*') {
    if (isNum(r) && r.value === 1) return l;
    if (isNum(l) && l.value === 1) return r;
    if (isNum(r) && r.value === 0) return { type: 'Num', value: 0 };
    if (isNum(l) && l.value === 0) return { type: 'Num', value: 0 };
  }
  return node;
}

/** 统计节点数。 */
export function nodeCount(node: AstNode): number {
  let n = 1;
  for (const c of node.children ?? []) n += nodeCount(c);
  return n;
}
