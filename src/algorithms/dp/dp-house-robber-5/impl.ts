// =============================================================================
// 打家劫舍 III · 树形 DP
// =============================================================================

export interface TreeNode5 {
  val: number;
  left?: TreeNode5 | null;
  right?: TreeNode5 | null;
}

export interface HouseRobberHooks {
  onVisit?: (val: number, rob: number, notRob: number) => void;
  onDone?: (best: number) => void;
}

export function robTree(root: TreeNode5 | null, hooks: HouseRobberHooks = {}): number {
  const dfs = (node: TreeNode5 | null): [number, number] => {
    if (!node) return [0, 0];
    const [lRob, lNot] = dfs(node.left ?? null);
    const [rRob, rNot] = dfs(node.right ?? null);
    const rob = node.val + lNot + rNot;
    const notRob = Math.max(lRob, lNot) + Math.max(rRob, rNot);
    hooks.onVisit?.(node.val, rob, notRob);
    return [rob, notRob];
  };
  const [rob, notRob] = dfs(root);
  const ans = Math.max(rob, notRob);
  hooks.onDone?.(ans);
  return ans;
}
