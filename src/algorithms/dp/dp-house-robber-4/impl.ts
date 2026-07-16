// =============================================================================
// 打家劫舍 III（树形 DP）· 纯算法实现
// =============================================================================

export interface TreeNodeVal {
  value: number;
  left: TreeNodeVal | null;
  right: TreeNodeVal | null;
}

export interface RobTreeHooks {
  onVisit?: (value: number, rob: number, notRob: number) => void;
  onDone?: (best: number) => void;
}

export function robTree(root: TreeNodeVal | null, hooks: RobTreeHooks = {}): number {
  const dfs = (node: TreeNodeVal | null): [number, number] => {
    if (!node) return [0, 0];
    const [lRob, lNot] = dfs(node.left);
    const [rRob, rNot] = dfs(node.right);
    const rob = node.value + lNot + rNot;
    const notRob = Math.max(lRob, lNot) + Math.max(rRob, rNot);
    hooks.onVisit?.(node.value, rob, notRob);
    return [rob, notRob];
  };
  const [r, nr] = dfs(root);
  const best = Math.max(r, nr);
  hooks.onDone?.(best);
  return best;
}

/** 从层序数组（含 null 占位）构建二叉树。 */
export function buildTree(arr: ReadonlyArray<number | null>): TreeNodeVal | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root: TreeNodeVal = { value: arr[0]!, left: null, right: null };
  const queue: TreeNodeVal[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length && arr[i] !== null) {
      node.left = { value: arr[i]!, left: null, right: null };
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = { value: arr[i]!, left: null, right: null };
      queue.push(node.right);
    }
    i++;
  }
  return root;
}
