// =============================================================================
// 翻转游戏 II · 纯算法实现 (LeetCode 294)
// 把连续 "++" 的位置翻转视作博弈。等价于计算每段连续 ++ 长度的 SG 值异或和。
// =============================================================================
export interface BtFlipGame2Hooks {
  onSegment?: (length: number, sg: number) => void;
  onXor?: (xorSum: number) => void;
  onConclude?: (firstWins: boolean) => void;
}

/** 计算长度为 n 的连续段 SG 表（sg[0..n]）。 */
function sgTable(n: number): number[] {
  const sg = new Array<number>(n + 1).fill(0);
  for (let i = 2; i <= n; i++) {
    const seen = new Set<number>();
    // 在位置 j..j+1 翻转，把段拆成 j 和 i-2-j 两段
    for (let j = 0; j <= i - 2; j++) {
      seen.add(sg[j]! ^ sg[i - 2 - j]!);
    }
    // mex
    let m = 0;
    while (seen.has(m)) m++;
    sg[i] = m;
  }
  return sg;
}

export function btFlipGame2(state: string, hooks: BtFlipGame2Hooks = {}): boolean {
  // 找所有连续 '+' 段长度
  const segs: number[] = [];
  let run = 0;
  for (const ch of state) {
    if (ch === '+') {
      run++;
    } else {
      if (run > 0) segs.push(run);
      run = 0;
    }
  }
  if (run > 0) segs.push(run);

  const maxLen = segs.reduce((a, b) => Math.max(a, b), 0);
  const sg = sgTable(Math.max(maxLen, 2));

  let xorSum = 0;
  for (const s of segs) {
    xorSum ^= sg[s]!;
    hooks.onSegment?.(s, sg[s]!);
  }
  hooks.onXor?.(xorSum);

  const firstWins = xorSum !== 0;
  hooks.onConclude?.(firstWins);
  return firstWins;
}
