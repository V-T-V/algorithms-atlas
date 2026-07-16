// =============================================================================
// Morris 遍历（Morris Inorder Traversal）· 纯算法实现
// O(1) 空间中序遍历。零 DOM 依赖，可独立单测。
// =============================================================================

/** 二叉树节点（可含临时右线索，但无需新增字段：复用 right 指针）。 */
export interface BTNode {
  value: number;
  left: BTNode | null;
  right: BTNode | null;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface MorrisHooks {
  /** 访问一个节点。 */
  onVisit?: (value: number) => void;
  /** 建立一条线索：pred → cur。 */
  onThread?: (pred: number, cur: number) => void;
  /** 断开一条线索（左子树遍历完毕）。 */
  onUnthread?: (pred: number, cur: number) => void;
}

/**
 * Morris 中序遍历：O(1) 空间。
 *
 * @param root 树根
 * @param hooks 可选的事件钩子
 * @returns 中序访问序列
 */
export function morrisInorder(root: BTNode | null, hooks: MorrisHooks = {}): number[] {
  const out: number[] = [];
  let cur: BTNode | null = root;
  while (cur !== null) {
    if (cur.left === null) {
      out.push(cur.value);
      hooks.onVisit?.(cur.value);
      cur = cur.right;
    } else {
      // 找中序前驱 pred = 左子树最右节点
      let pred = cur.left;
      while (pred.right !== null && pred.right !== cur) pred = pred.right;
      if (pred.right === null) {
        // 建立线索 pred → cur
        pred.right = cur;
        hooks.onThread?.(pred.value, cur.value);
        cur = cur.left;
      } else {
        // 线索已存在 → 左子树遍历完毕，断开线索并访问 cur
        pred.right = null;
        hooks.onUnthread?.(pred.value, cur.value);
        out.push(cur.value);
        hooks.onVisit?.(cur.value);
        cur = cur.right;
      }
    }
  }
  return out;
}

/** 从层序数组（含 null 表示缺位）构建二叉树。 */
export function buildTree(values: Array<number | null>): BTNode | null {
  if (values.length === 0 || values[0] === null) return null;
  const root: BTNode = { value: values[0]!, left: null, right: null };
  const queue: BTNode[] = [root];
  let i = 1;
  while (queue.length > 0 && i < values.length) {
    const node = queue.shift()!;
    if (i < values.length) {
      const lv = values[i]!;
      if (lv !== null) {
        node.left = { value: lv, left: null, right: null };
        queue.push(node.left);
      }
      i++;
    }
    if (i < values.length) {
      const rv = values[i]!;
      if (rv !== null) {
        node.right = { value: rv, left: null, right: null };
        queue.push(node.right);
      }
      i++;
    }
  }
  return root;
}

/** 深拷贝树（用于断言结构未被 Morris 破坏）。 */
export function cloneTree(node: BTNode | null): BTNode | null {
  if (!node) return null;
  return { value: node.value, left: cloneTree(node.left), right: cloneTree(node.right) };
}

/** 判等两棵树。 */
export function treeEqual(a: BTNode | null, b: BTNode | null): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return a.value === b.value && treeEqual(a.left, b.left) && treeEqual(a.right, b.right);
}
