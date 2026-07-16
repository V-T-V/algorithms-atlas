// =============================================================================
// 森林 Grundy 计算 · 纯算法实现
// 经典问题：Colon Principle / "Green Hackenbush 树"。每棵树是一根连接根的茎，
// 每个节点可被"剪掉"，剪掉后该节点子树全部移除，剩余部分继续博弈。
// SG(节点 v) = mex{ SG(v 的某子树组合) }，对树用 Colon 原理：SG(v)=1+异或所有子节点SG?
// 这里实现通用：每棵树给根，森林异或。
// =============================================================================
export interface GameGrundyForestHooks {
  onNodeSg?: (node: string, sg: number) => void;
  onForest?: (xorSum: number) => void;
  onConclude?: (firstWins: boolean) => void;
}

export interface GameNode {
  id: string;
  children?: GameNode[];
}

/** 计算单棵树的 SG（Green Hackenbush 茎：SG=1⊕各子树SG 的 nim-sum 的 ... 用竹林规则 sg=异或(子sg+1)）。 */
function treeSg(node: GameNode, hooks: GameGrundyForestHooks): number {
  if (!node.children || node.children.length === 0) {
    hooks.onNodeSg?.(node.id, 1);
    return 1; // 单茎 SG=1
  }
  let xor = 0;
  for (const ch of node.children) {
    xor ^= treeSg(ch, hooks) + 1; // 竹林：子茎长度 = sg+1 贡献
  }
  hooks.onNodeSg?.(node.id, xor);
  return xor;
}

export function gameGrundyForest(forest: GameNode[], hooks: GameGrundyForestHooks = {}): number {
  let xorSum = 0;
  for (const tree of forest) {
    xorSum ^= treeSg(tree, hooks);
  }
  hooks.onForest?.(xorSum);
  const firstWins = xorSum !== 0;
  hooks.onConclude?.(firstWins);
  return xorSum;
}
