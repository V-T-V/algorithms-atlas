// =============================================================================
// 对称二叉树（Symmetric Tree）· 纯算法实现
// =============================================================================

/** 二叉树节点。 */
export interface BTNode {
  value: number;
  left: BTNode | null;
  right: BTNode | null;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface SymmetricHooks {
  /** 比较节点 a 与节点 b 的值（镜像对）。给出值或 null。 */
  onCompare?: (a: number | null, b: number | null) => void;
  /** 完成。 */
  onDone?: (symmetric: boolean) => void;
}

/** 判定两棵子树是否互为镜像。 */
function isMirror(
  a: BTNode | null,
  b: BTNode | null,
  hooks?: SymmetricHooks['onCompare'],
): boolean {
  if (a === null && b === null) return true;
  if (a === null || b === null) return false;
  hooks?.(a.value, b.value);
  return (
    a.value === b.value && isMirror(a.left, b.right, hooks) && isMirror(a.right, b.left, hooks)
  );
}

/**
 * 对称二叉树判定。
 *
 * @param root 树根
 * @param hooks 可选的事件钩子
 */
export function isSymmetric(root: BTNode | null, hooks: SymmetricHooks = {}): boolean {
  const result = root === null ? true : isMirror(root.left, root.right, hooks.onCompare);
  hooks.onDone?.(result);
  return result;
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
