// =============================================================================
// 红黑树旋转 · 纯算法实现
// =============================================================================

export type Color = 'R' | 'B';

export class RBNode {
  constructor(
    public value: number,
    public color: Color = 'R',
    public left: RBNode | null = null,
    public right: RBNode | null = null,
    public parent: RBNode | null = null,
  ) {}
}

export interface RotationHooks {
  onRotate?: (dir: 'L' | 'R', at: number) => void;
  onColor?: (at: number, to: Color) => void;
}

export function isRed(node: RBNode | null): boolean {
  return node !== null && node.color === 'R';
}

/** 左旋：以 x 为支点。 */
export function rotateLeft(x: RBNode): RBNode {
  const y = x.right!;
  x.right = y.left;
  if (y.left !== null) y.left.parent = x;
  y.parent = x.parent;
  if (x.parent === null) {
    // y 是新根
  } else if (x === x.parent.left) x.parent.left = y;
  else x.parent.right = y;
  y.left = x;
  x.parent = y;
  return y;
}

/** 右旋：以 x 为支点。 */
export function rotateRight(x: RBNode): RBNode {
  const y = x.left!;
  x.left = y.right;
  if (y.right !== null) y.right.parent = x;
  y.parent = x.parent;
  if (x.parent === null) {
    // y 是新根
  } else if (x === x.parent.right) x.parent.right = y;
  else x.parent.left = y;
  y.right = x;
  x.parent = y;
  return y;
}

function bstInsert(root: RBNode | null, node: RBNode): RBNode {
  let parent: RBNode | null = null;
  let cur = root;
  while (cur !== null) {
    parent = cur;
    cur = node.value < cur.value ? cur.left : cur.right;
  }
  node.parent = parent;
  if (parent === null) return node; // 树空
  if (node.value < parent.value) parent.left = node;
  else parent.right = node;
  return root!;
}

function findRoot(node: RBNode): RBNode {
  while (node.parent !== null) node = node.parent;
  return node;
}

/** 插入修复。返回新根。 */
export function insertFixup(node: RBNode, hooks: RotationHooks = {}): RBNode {
  let z = node;
  while (z.parent !== null && isRed(z.parent)) {
    const gp = z.parent.parent!;
    if (z.parent === gp.left) {
      const uncle = gp.right;
      if (isRed(uncle)) {
        // Case 1
        hooks.onColor?.(z.parent.value, 'B');
        z.parent.color = 'B';
        uncle!.color = 'B';
        hooks.onColor?.(gp.value, 'R');
        gp.color = 'R';
        z = gp;
      } else {
        if (z === z.parent.right) {
          // Case 2: 折线 → 拉直
          z = z.parent;
          hooks.onRotate?.('L', z.value);
          rotateLeft(z);
        }
        // Case 3
        const p = z.parent!;
        const gpp = p.parent!;
        hooks.onColor?.(p.value, 'B');
        p.color = 'B';
        hooks.onColor?.(gpp.value, 'R');
        gpp.color = 'R';
        hooks.onRotate?.('R', gpp.value);
        rotateRight(gpp);
      }
    } else {
      // 对称
      const uncle = gp.left;
      if (isRed(uncle)) {
        hooks.onColor?.(z.parent.value, 'B');
        z.parent.color = 'B';
        uncle!.color = 'B';
        hooks.onColor?.(gp.value, 'R');
        gp.color = 'R';
        z = gp;
      } else {
        if (z === z.parent.left) {
          z = z.parent;
          hooks.onRotate?.('R', z.value);
          rotateRight(z);
        }
        const p = z.parent!;
        const gpp = p.parent!;
        hooks.onColor?.(p.value, 'B');
        p.color = 'B';
        hooks.onColor?.(gpp.value, 'R');
        gpp.color = 'R';
        hooks.onRotate?.('L', gpp.value);
        rotateLeft(gpp);
      }
    }
  }
  const root = findRoot(z);
  if (root.color !== 'B') {
    hooks.onColor?.(root.value, 'B');
    root.color = 'B';
  }
  return root;
}

export function insert(root: RBNode | null, key: number, hooks: RotationHooks = {}): RBNode {
  const node = new RBNode(key, 'R');
  bstInsert(root, node);
  return insertFixup(node, hooks);
}

export function buildRB(keys: number[], hooks: RotationHooks = {}): RBNode | null {
  let root: RBNode | null = null;
  for (const k of keys) root = insert(root, k, hooks);
  return root;
}

export function inorder(root: RBNode | null): number[] {
  if (root === null) return [];
  return [...inorder(root.left), root.value, ...inorder(root.right)];
}

/** 黑高：从 node 到任一叶子路径的黑节点数（不计自身）。 */
export function blackHeight(node: RBNode | null): number {
  if (node === null) return 1;
  const self = node.color === 'B' ? 1 : 0;
  const lh = blackHeight(node.left);
  const rh = blackHeight(node.right);
  return self + Math.max(lh, rh);
}

/** 校验性质 4 & 5。 */
export function isValidRB(root: RBNode | null): boolean {
  if (root === null) return true;
  if (root.color !== 'B') return false;
  const check = (n: RBNode | null): { ok: boolean; bh: number } => {
    if (n === null) return { ok: true, bh: 1 };
    if (isRed(n) && (isRed(n.left) || isRed(n.right))) return { ok: false, bh: 0 };
    const l = check(n.left);
    if (!l.ok) return l;
    const r = check(n.right);
    if (!r.ok) return r;
    if (l.bh !== r.bh) return { ok: false, bh: 0 };
    return { ok: true, bh: l.bh + (n.color === 'B' ? 1 : 0) };
  };
  return check(root).ok;
}

export function treeHeight(node: RBNode | null): number {
  if (node === null) return 0;
  return 1 + Math.max(treeHeight(node.left), treeHeight(node.right));
}
