// =============================================================================
// 二叉搜索树 Binary Search Tree · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：标准 BST 的插入与查找（不做自平衡）。
// =============================================================================

import type { BarRole } from '../../../types.ts';

/** BST 内部节点。 */
export interface BstNode {
  value: number;
  left: BstNode | null;
  right: BstNode | null;
}

/** 插入过程的事件钩子。任一可选。 */
export interface BstInsertHooks {
  /** 插入时与某节点比较：dir = 'left' | 'right' 表示下一去往方向，或 'stay' 表示命中相等。 */
  onCompare?: (current: number, target: number, dir: 'left' | 'right' | 'stay') => void;
  /** 成功插入新值（作为叶子）。 */
  onInsert?: (value: number, parent: number | null) => void;
}

/** 查找过程的事件钩子。任一可选。 */
export interface BstSearchHooks {
  onCompare?: (current: number, target: number, dir: 'left' | 'right' | 'found') => void;
  /** 查找结束；found 表示是否命中。 */
  onResult?: (target: number, found: boolean) => void;
}

/**
 * 二叉搜索树（不保证平衡）。
 * 左子树所有值 < 节点值；右子树所有值 > 节点值（不允许重复值插入）。
 */
export class BST {
  root: BstNode | null = null;

  /** 插入一个值（若已存在则忽略，返回是否实际插入）。 */
  insert(value: number, hooks: BstInsertHooks = {}): boolean {
    if (this.root === null) {
      this.root = { value, left: null, right: null };
      hooks.onInsert?.(value, null);
      return true;
    }
    let node = this.root;
    for (;;) {
      if (value === node.value) {
        hooks.onCompare?.(node.value, value, 'stay');
        return false; // 重复，忽略
      }
      if (value < node.value) {
        hooks.onCompare?.(node.value, value, 'left');
        if (node.left === null) {
          node.left = { value, left: null, right: null };
          hooks.onInsert?.(value, node.value);
          return true;
        }
        node = node.left;
      } else {
        hooks.onCompare?.(node.value, value, 'right');
        if (node.right === null) {
          node.right = { value, left: null, right: null };
          hooks.onInsert?.(value, node.value);
          return true;
        }
        node = node.right;
      }
    }
  }

  /** 查找值是否存在。 */
  search(value: number, hooks: BstSearchHooks = {}): boolean {
    let node = this.root;
    while (node !== null) {
      if (value === node.value) {
        hooks.onCompare?.(node.value, value, 'found');
        hooks.onResult?.(value, true);
        return true;
      }
      if (value < node.value) {
        hooks.onCompare?.(node.value, value, 'left');
        node = node.left;
      } else {
        hooks.onCompare?.(node.value, value, 'right');
        node = node.right;
      }
    }
    hooks.onResult?.(value, false);
    return false;
  }

  /** 中序遍历（升序输出）。 */
  inorder(): number[] {
    const out: number[] = [];
    const visit = (n: BstNode | null): void => {
      if (!n) return;
      visit(n.left);
      out.push(n.value);
      visit(n.right);
    };
    visit(this.root);
    return out;
  }
}

/** 可视化用的树节点（与 types.ts 的 TreeNode 兼容）。 */
export interface VizNode {
  id: string;
  value: number;
  children?: VizNode[];
  role?: BarRole;
}

/**
 * 将 BST 转为可视化树（可用于 setTree）。highlight 标记当前高亮值。
 */
export function toVizTree(
  root: BstNode | null,
  highlight: ReadonlySet<number> = new Set(),
): VizNode | null {
  if (!root) return null;
  let counter = 0;
  const build = (n: BstNode | null): VizNode | null => {
    if (!n) return null;
    const id = `n${counter++}`;
    const children: VizNode[] = [];
    const l = build(n.left);
    const r = build(n.right);
    if (l) children.push(l);
    if (r) children.push(r);
    return {
      id,
      value: n.value,
      children: children.length ? children : undefined,
      role: highlight.has(n.value) ? 'compare' : undefined,
    };
  };
  return build(root);
}

/** 便利函数：批量插入构建 BST（驱动 trace/测试）。返回 BST 实例。 */
export function bst(values: readonly number[], insertHooks: BstInsertHooks = {}): BST {
  const tree = new BST();
  for (const v of values) tree.insert(v, insertHooks);
  return tree;
}
