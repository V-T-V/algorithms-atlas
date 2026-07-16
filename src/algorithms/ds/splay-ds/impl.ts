// =============================================================================
// 伸展树 SplayTree · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：自调整 BST。每次访问（插入/查找）后把目标节点 splay 到根。
//   - zig / zag：目标与根相邻，单旋。
//   - zig-zig / zag-zag：同向链，先旋父再旋祖父。
//   - zig-zag / zag-zig：异向，两次同向旋转。
//   - 「Top-down」逐层比较 + 「Bottom-up」自顶向根实现：这里用带父指针的节点结构。
//   - 摊还 O(log n) 每操作；不保证严格平衡，但热点节点贴近根部。
// =============================================================================

/** Splay 节点（带父指针）。 */
export class SplayNode {
  value: number;
  left: SplayNode | null = null;
  right: SplayNode | null = null;
  parent: SplayNode | null = null;
  constructor(value: number) {
    this.value = value;
  }
}

/** 旋转情形。 */
export type SplayCase = 'zig' | 'zag' | 'zig-zig' | 'zag-zag' | 'zig-zag' | 'zag-zig';

/** Splay 操作过程中的事件钩子。任一可选。 */
export interface SplayHooks {
  /** 比较 value 与节点值，dir 为走向。 */
  onCompare?: (value: number, nodeValue: number, dir: 'left' | 'right' | 'equal') => void;
  /** 插入新节点（值）。 */
  onInsert?: (value: number) => void;
  /** 发生一次旋转：case + 涉及节点值。 */
  onRotate?: (splayCase: SplayCase, value: number) => void;
  /** 一次 splay 操作开始（目标 value）。 */
  onSplay?: (value: number) => void;
  /** splay 完成，节点已到根。 */
  onSplayDone?: (rootValue: number) => void;
}

/**
 * 伸展树（自调整二叉搜索树）。
 * 插入/查找均把目标节点 splay 到根。摊还 O(log n)。
 */
export class SplayTree {
  /** 根节点。 */
  root: SplayNode | null = null;
  private count = 0;

  get size(): number {
    return this.count;
  }

  /** 左旋：x 为右子，提上来。 */
  private leftRotate(x: SplayNode): void {
    const y = x.right!;
    x.right = y.left;
    if (y.left) y.left.parent = x;
    this.transplant(x, y);
    y.left = x;
    x.parent = y;
  }

  /** 右旋：x 为左子，提上来。 */
  private rightRotate(x: SplayNode): void {
    const y = x.left!;
    x.left = y.right;
    if (y.right) y.right.parent = x;
    this.transplant(x, y);
    y.right = x;
    x.parent = y;
  }

  /** 用子树 v 替换 u 的位置（处理父子链接）。 */
  private transplant(u: SplayNode, v: SplayNode | null): void {
    if (u.parent === null) this.root = v;
    else if (u === u.parent.left) u.parent.left = v;
    else u.parent.right = v;
    if (v) v.parent = u.parent;
  }

  /** 把节点 x splay 到根。 */
  private splay(x: SplayNode, hooks: SplayHooks): void {
    hooks.onSplay?.(x.value);
    while (x.parent !== null) {
      const parent = x.parent;
      const grand = parent.parent;
      if (grand === null) {
        // zig / zag
        if (x === parent.left) {
          hooks.onRotate?.('zig', x.value);
          this.rightRotate(parent);
        } else {
          hooks.onRotate?.('zag', x.value);
          this.leftRotate(parent);
        }
      } else if (x === parent.left && parent === grand.left) {
        // zig-zig
        hooks.onRotate?.('zig-zig', x.value);
        this.rightRotate(grand);
        this.rightRotate(parent);
      } else if (x === parent.right && parent === grand.right) {
        // zag-zag
        hooks.onRotate?.('zag-zag', x.value);
        this.leftRotate(grand);
        this.leftRotate(parent);
      } else if (x === parent.right && parent === grand.left) {
        // zig-zag
        hooks.onRotate?.('zig-zag', x.value);
        this.leftRotate(parent);
        this.rightRotate(grand);
      } else {
        // zag-zig
        hooks.onRotate?.('zag-zig', x.value);
        this.rightRotate(parent);
        this.leftRotate(grand);
      }
    }
    hooks.onSplayDone?.(x.value);
  }

  /** 插入 value（重复值会 splay 已有节点到根）。 */
  insert(value: number, hooks: SplayHooks = {}): boolean {
    let cur = this.root;
    let parent: SplayNode | null = null;
    while (cur !== null) {
      parent = cur;
      if (value === cur.value) {
        hooks.onCompare?.(value, cur.value, 'equal');
        this.splay(cur, hooks); // 已存在，splay 到根
        return false;
      }
      if (value < cur.value) {
        hooks.onCompare?.(value, cur.value, 'left');
        cur = cur.left;
      } else {
        hooks.onCompare?.(value, cur.value, 'right');
        cur = cur.right;
      }
    }
    const node = new SplayNode(value);
    node.parent = parent;
    if (parent === null) this.root = node;
    else if (value < parent.value) parent.left = node;
    else parent.right = node;
    this.count++;
    hooks.onInsert?.(value);
    this.splay(node, hooks);
    return true;
  }

  /** 查找 value：存在则 splay 到根并返回 true。 */
  search(value: number, hooks: SplayHooks = {}): boolean {
    let cur = this.root;
    let last: SplayNode | null = null;
    while (cur !== null) {
      last = cur;
      if (value === cur.value) {
        hooks.onCompare?.(value, cur.value, 'equal');
        this.splay(cur, hooks);
        return true;
      }
      if (value < cur.value) {
        hooks.onCompare?.(value, cur.value, 'left');
        cur = cur.left;
      } else {
        hooks.onCompare?.(value, cur.value, 'right');
        cur = cur.right;
      }
    }
    // 未命中：splay 最后访问的节点到根（标准做法）
    if (last) this.splay(last, hooks);
    return false;
  }

  /** 中序遍历 → 升序数组。 */
  toArray(): number[] {
    const out: number[] = [];
    const walk = (n: SplayNode | null): void => {
      if (!n) return;
      walk(n.left);
      out.push(n.value);
      walk(n.right);
    };
    walk(this.root);
    return out;
  }

  /** 是否仍为合法 BST（中序升序）。 */
  isValid(): boolean {
    const arr = this.toArray();
    for (let i = 1; i < arr.length; i++) if (arr[i - 1]! >= arr[i]!) return false;
    return true;
  }
}

/**
 * 便利函数：批量插入值构造伸展树，返回实例。
 * 每步通过 hooks 暴露。
 */
export function splayDs(values: readonly number[], hooks: SplayHooks = {}): SplayTree {
  const tree = new SplayTree();
  for (const v of values) tree.insert(v, hooks);
  return tree;
}
