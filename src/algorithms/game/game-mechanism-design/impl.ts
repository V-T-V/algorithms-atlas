// 机制设计（VCG 单物品）· 实现
export interface VCGHooks {
  onAllocate?: (winnerIdx: number, winningValue: number) => void;
  onExternality?: (idx: number, payment: number) => void;
  onConclude?: (allocations: number[], payments: number[]) => void;
}
export interface VCGResult {
  winnerIdx: number;
  payments: number[];
}
export function gameMechanismDesign(bids: readonly number[], hooks: VCGHooks = {}): VCGResult {
  const n = bids.length;
  if (n === 0) throw new Error('bids 不能为空 / bids must be non-empty');
  // 分配：最高者中标
  let winnerIdx = 0;
  let top = bids[0]!;
  for (let i = 1; i < n; i++)
    if (bids[i]! > top) {
      top = bids[i]!;
      winnerIdx = i;
    }
  hooks.onAllocate?.(winnerIdx, top);
  // 第二高 = 没有 winner 时最大社会福利
  let second = -Infinity;
  for (let i = 0; i < n; i++) if (i !== winnerIdx) second = Math.max(second, bids[i]!);
  if (second === -Infinity) second = 0;
  // 只有中标者付费 = 外部性 = second（他人因他存在损失的福利）
  const payments = new Array(n).fill(0);
  payments[winnerIdx] = second;
  for (let i = 0; i < n; i++) hooks.onExternality?.(i, payments[i]!);
  hooks.onConclude?.([winnerIdx], payments);
  return { winnerIdx, payments };
}
