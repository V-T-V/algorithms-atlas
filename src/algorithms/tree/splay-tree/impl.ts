// =============================================================================
// 伸展树 Splay Tree · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 自平衡 BST：每次访问（插入/查找）的节点通过旋转被「伸展」到根。
//   - zig：x 的父节点是根，单旋一次
//   - zig-zig：x 与父、祖父同侧 → 先转父，再转 x
//   - zig-zag：x 与父异侧 → 先转 x，再转 x（两次异向单旋）
// 摊还 O(log n)。实现采用「自顶向下」的 splay 算法之外的自底向上版本（带父指针）。
// =============================================================================

/** 伸展树节点（带父指针，便于自底向上 splay）。 */
export interface SplayNode {
  value: number;
  left: SplayNode | null;
  right: SplayNode | null;
  parent: SplayNode | null;
}

/** 伸展树执行过程中的事件钩子。任一可选。 */
export interface SplayHooks {
  /** 比较 value 与节点 nodeValue（dir: 'left' | 'right'）。 */
  onCompare?: (value: number, nodeValue: number, dir: 'left' | 'right') => void;
  /** 发生一次 splay 步骤：type ∈ {zig, zig-zig, zig-zag}。 */
  onSplay?: (type: 'zig' | 'zig-zig' | 'zig-zag', xValue: number) => void;
  /** 一个新节点被插入。 */
  onInsert?: (value: number) => void;
  /** splay 完成：value 已成为新的根。 */
  onSplayDone?: (value: number) => void;
}

/** 右旋（围绕 y，其左子 x 上提）。 */
function rotateRight(y: SplayNode): void {
  const x = y.left!;
  const p = y.parent;
  y.left = x.right;
  if (x.right) x.right.parent = y;
  x.right = y;
  y.parent = x;
  x.parent = p;
  if (p) {
    if (p.left === y) p.left = x;
    else p.right = x;
  }
}

/** 左旋（围绕 x，其右子 y 上提）。 */
function rotateLeft(x: SplayNode): void {
  const y = x.right!;
  const p = x.parent;
  x.right = y.left;
  if (y.left) y.left.parent = x;
  y.left = x;
  x.parent = y;
  y.parent = p;
  if (p) {
    if (p.left === x) p.left = y;
    else p.right = y;
  }
}

/**
 * 伸展树。
 */
export class SplayTree {
  private root: SplayNode | null = null;
  private len = 0;

  get size(): number {
    return this.len;
  }

  isEmpty(): boolean {
    return this.root === null;
  }

  /** 当前根（供 trace 读取结构）。 */
  getRoot(): SplayNode | null {
    return this.root;
  }

  /** 把节点 x 伸展到根。 */
  private splay(x: SplayNode, hooks: SplayHooks): void {
    while (x.parent !== null) {
      const p = x.parent;
      const g = p.parent;
      if (g === null) {
        // zig：x 的父是根
        hooks.onSplay?.('zig', x.value);
        if (p.left === x) rotateRight(p);
        else rotateLeft(p);
      } else if ((g.left === p && p.left === x) || (g.right === p && p.right === x)) {
        // zig-zig：同侧
        hooks.onSplay?.('zig-zig', x.value);
        if (p.left === x) {
          rotateRight(g);
          rotateRight(p);
        } else {
          rotateLeft(g);
          rotateLeft(p);
        }
      } else {
        // zig-zag：异侧
        hooks.onSplay?.('zig-zag', x.value);
        if (p.left === x) {
          rotateRight(p);
          rotateLeft(g);
        } else {
          rotateLeft(p);
          rotateRight(g);
        }
      }
    }
    this.root = x;
  }

  /** 插入 value（重复忽略）。插入后把新节点 splay 到根。 */
  insert(value: number, hooks: SplayHooks = {}): boolean {
    if (this.root === null) {
      this.root = { value, left: null, right: null, parent: null };
      this.len++;
      hooks.onInsert?.(value);
      hooks.onSplayDone?.(value);
      return true;
    }
    let cur: SplayNode | null = this.root;
    let parent: SplayNode | null = null;
    while (cur !== null) {
      parent = cur;
      if (value < cur.value) {
        hooks.onCompare?.(value, cur.value, 'left');
        cur = cur.left;
      } else if (value > cur.value) {
        hooks.onCompare?.(value, cur.value, 'right');
        cur = cur.right;
      } else {
        // 重复：把已存在节点 splay 到根
        this.splay(cur, hooks);
        hooks.onSplayDone?.(value);
        return false;
      }
    }
    const node: SplayNode = { value, left: null, right: null, parent };
    if (value < parent!.value) parent!.left = node;
    else parent!.right = node;
    this.len++;
    hooks.onInsert?.(value);
    this.splay(node, hooks);
    hooks.onSplayDone?.(value);
    return true;
  }

  /** 查找 value：命中则把该节点 splay 到根并返回 true。 */
  search(value: number, hooks: SplayHooks = {}): boolean {
    let cur = this.root;
    let last: SplayNode | null = null;
    while (cur !== null) {
      last = cur;
      if (value < cur.value) {
        hooks.onCompare?.(value, cur.value, 'left');
        cur = cur.left;
      } else if (value > cur.value) {
        hooks.onCompare?.(value, cur.value, 'right');
        cur = cur.right;
      } else {
        // 命中：splay 到根
        this.splay(cur, hooks);
        hooks.onSplayDone?.(value);
        return true;
      }
    }
    // 未命中：把最后访问的节点 splay 到根（标准语义）
    if (last) this.splay(last, hooks);
    hooks.onSplayDone?.(value);
    return false;
  }

  /** 中序遍历（升序）。 */
  inorder(): number[] {
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
}

/** 校验 BST 性质。 */
export function isBST(root: SplayNode | null): boolean {
  const check = (n: SplayNode | null, lo: number, hi: number): boolean => {
    if (!n) return true;
    if (n.value <= lo || n.value >= hi) return false;
    return check(n.left, lo, n.value) && check(n.right, n.value, hi);
  };
  return check(root, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
}

/**
 * 便利函数：顺序插入 values 构建伸展树，返回中序序列（升序）。
 */
export function splayTree(values: readonly number[], hooks: SplayHooks = {}): number[] {
  const t = new SplayTree();
  for (const v of values) t.insert(v, hooks);
  return t.inorder();
}
