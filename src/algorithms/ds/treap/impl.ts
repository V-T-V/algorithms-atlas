// =============================================================================
// 树堆 Treap · 纯算法实现
// BST + 堆：按 key 维持 BST 序，按随机 priority 维持堆序（用旋转维护）。
// 零 DOM 依赖，可独立单测。通过 hooks 暴露每步操作供录制器使用。
// =============================================================================

/** Treap 节点（纯数据）。priority 越大越靠近根（大顶堆）。 */
export interface TreapNode {
  key: number;
  priority: number;
  left: TreapNode | null;
  right: TreapNode | null;
}

export interface TreapHooks {
  /** 比较 key 与节点 node.key（dir: 'left' | 'right'）。 */
  onCompare?: (key: number, nodeKey: number, dir: 'left' | 'right') => void;
  /** 插入了一个新节点（含其优先级）。 */
  onInsert?: (key: number, priority: number) => void;
  /** 发生旋转：'left' 或 'right'，围绕 pivotKey。 */
  onRotate?: (type: 'left' | 'right', pivotKey: number) => void;
}

// —— 固定种子的线性同余 PRNG，保证可复现 ——
let seed = 20240601;
function rand(): number {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed;
}
/** 重置 PRNG 种子（用于可复现测试/演示）。 */
export function resetSeed(s = 20240601): void {
  seed = s;
}

function rotateRight(y: TreapNode): TreapNode {
  const x = y.left!;
  y.left = x.right;
  x.right = y;
  return x;
}

function rotateLeft(x: TreapNode): TreapNode {
  const y = x.right!;
  x.right = y.left;
  y.left = x;
  return y;
}

/** 在子树 node 上插入 (key, priority)，返回新子树根。 */
function insertNode(
  node: TreapNode | null,
  key: number,
  priority: number,
  hooks: TreapHooks,
): TreapNode {
  if (node === null) {
    hooks.onInsert?.(key, priority);
    return { key, priority, left: null, right: null };
  }
  if (key < node.key) {
    hooks.onCompare?.(key, node.key, 'left');
    node.left = insertNode(node.left, key, priority, hooks);
    // 堆序：左子 priority 更大 → 右旋
    if (node.left!.priority > node.priority) {
      hooks.onRotate?.('right', node.key);
      return rotateRight(node);
    }
    return node;
  }
  if (key > node.key) {
    hooks.onCompare?.(key, node.key, 'right');
    node.right = insertNode(node.right, key, priority, hooks);
    if (node.right!.priority > node.priority) {
      hooks.onRotate?.('left', node.key);
      return rotateLeft(node);
    }
    return node;
  }
  // 重复 key 不插入
  return node;
}

/** 顺序插入 keys，返回 Treap 根。每个 key 的优先级由固定种子 PRNG 生成。 */
export function treapInsert(
  keys: readonly number[],
  hooks: TreapHooks = {},
  options: { seed?: number } = {},
): TreapNode | null {
  if (options.seed !== undefined) resetSeed(options.seed);
  let root: TreapNode | null = null;
  for (const k of keys) {
    const p = rand();
    root = insertNode(root, k, p, hooks);
  }
  return root;
}

/** 中序遍历（应得升序）。 */
export function inorder(root: TreapNode | null): number[] {
  const out: number[] = [];
  const walk = (n: TreapNode | null): void => {
    if (!n) return;
    walk(n.left);
    out.push(n.key);
    walk(n.right);
  };
  walk(root);
  return out;
}

/** 校验：BST 序 + 堆序（父 priority ≥ 子）。 */
export function isTreap(root: TreapNode | null): boolean {
  const check = (n: TreapNode | null, min: number, max: number, parentP: number): boolean => {
    if (!n) return true;
    if (n.priority > parentP) return false; // 父优先级应更大
    if (n.key <= min || n.key >= max) return false;
    return check(n.left, min, n.key, n.priority) && check(n.right, n.key, max, n.priority);
  };
  return check(root, -Infinity, Infinity, Infinity);
}
