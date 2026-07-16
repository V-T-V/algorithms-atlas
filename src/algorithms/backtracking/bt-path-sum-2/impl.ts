export interface TNode {
  val: number;
  left: TNode | null;
  right: TNode | null;
}
export interface Ps2Hooks {
  onPush?: (v: number) => void;
  onResult?: (p: number[]) => void;
}
export function pathSum(root: TNode | null, target: number, hooks: Ps2Hooks = {}): number[][] {
  const out: number[][] = [];
  const cur: number[] = [];
  const dfs = (node: TNode | null, remain: number) => {
    if (!node) return;
    cur.push(node.val);
    hooks.onPush?.(node.val);
    if (!node.left && !node.right && remain === node.val) {
      out.push([...cur]);
      hooks.onResult?.([...cur]);
    }
    dfs(node.left, remain - node.val);
    dfs(node.right, remain - node.val);
    cur.pop();
  };
  dfs(root, target);
  return out;
}
