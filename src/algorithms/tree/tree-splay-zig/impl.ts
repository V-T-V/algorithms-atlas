// =============================================================================
// 伸展树 Zig/Zig-zig/Zig-zag · 纯算法实现
// =============================================================================

export class SplayNode {
  constructor(
    public value: number,
    public left: SplayNode | null = null,
    public right: SplayNode | null = null,
  ) {}
}

export interface SplayHooks {
  onStep?: (kind: 'Zig' | 'ZigZig' | 'ZigZag', at: number) => void;
}

/** 右旋：把 y 的左儿子 x 提上来。 */
export function rotateRight(y: SplayNode): SplayNode {
  const x = y.left!;
  y.left = x.right;
  x.right = y;
  return x;
}

/** 左旋：把 x 的右儿子 y 提上来。 */
export function rotateLeft(x: SplayNode): SplayNode {
  const y = x.right!;
  x.right = y.left;
  y.left = x;
  return y;
}

/** 自顶向下伸展：将 key 移到根。返回新根。 */
export function splay(
  root: SplayNode | null,
  key: number,
  hooks: SplayHooks = {},
): SplayNode | null {
  if (root === null) return null;
  // 头节点辅助
  const header = new SplayNode(0);
  let leftMax = header;
  let rightMin = header;
  let t: SplayNode | null = root;

  while (true) {
    if (key < t!.value) {
      if (t!.left === null) break;
      if (key < t!.left!.value) {
        // Zig-zig（左侧）
        hooks.onStep?.('ZigZig', t!.value);
        t = rotateRight(t!);
        if (t!.left === null) break;
      } else if (key > t!.left!.value) {
        // Zig-zag（左侧）
        hooks.onStep?.('ZigZag', t!.value);
      }
      // 连接到右树
      rightMin.left = t;
      rightMin = t;
      t = t!.left;
    } else if (key > t!.value) {
      if (t!.right === null) break;
      if (key > t!.right!.value) {
        // Zig-zig（右侧）
        hooks.onStep?.('ZigZig', t!.value);
        t = rotateLeft(t!);
        if (t!.right === null) break;
      } else if (key < t!.right!.value) {
        // Zig-zag（右侧）
        hooks.onStep?.('ZigZag', t!.value);
      }
      leftMax.right = t;
      leftMax = t;
      t = t!.right;
    } else {
      break;
    }
  }

  hooks.onStep?.('Zig', t!.value);

  // 重组
  leftMax.right = t!.left;
  rightMin.left = t!.right;
  t!.left = header.right;
  t!.right = header.left;
  return t;
}

export function insert(root: SplayNode | null, key: number, hooks: SplayHooks = {}): SplayNode {
  if (root === null) return new SplayNode(key);
  const splayed = splay(root, key, hooks)!;
  if (splayed.value === key) return splayed; // 已存在
  const node = new SplayNode(key);
  if (key < splayed.value) {
    node.right = splayed;
    node.left = splayed.left;
    splayed.left = null;
  } else {
    node.left = splayed;
    node.right = splayed.right;
    splayed.right = null;
  }
  return node;
}

export function search(
  root: SplayNode | null,
  key: number,
  hooks: SplayHooks = {},
): SplayNode | null {
  if (root === null) return null;
  const splayed = splay(root, key, hooks);
  return splayed !== null && splayed.value === key ? splayed : null;
}

export function buildSplay(keys: number[], hooks: SplayHooks = {}): SplayNode | null {
  let root: SplayNode | null = null;
  for (const k of keys) root = insert(root, k, hooks);
  return root;
}

export function inorder(root: SplayNode | null): number[] {
  if (root === null) return [];
  return [...inorder(root.left), root.value, ...inorder(root.right)];
}

export function height(node: SplayNode | null): number {
  if (node === null) return 0;
  return 1 + Math.max(height(node.left), height(node.right));
}
