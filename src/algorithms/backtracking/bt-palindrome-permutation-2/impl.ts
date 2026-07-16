// =============================================================================
// 回文排列 II · 纯算法实现 (LeetCode 267)
// 取每个字母一半频数做全排列，中间放奇数字符，镜像拼成回文。
// =============================================================================
export interface BtPalindromePermutation2Hooks {
  onPerm?: (half: string[]) => void;
  onBuild?: (full: string) => void;
}

export function btPalindromePermutation2(
  s: string,
  hooks: BtPalindromePermutation2Hooks = {},
): string[] {
  const counts: Record<string, number> = {};
  for (const ch of s) counts[ch] = (counts[ch] ?? 0) + 1;

  let oddChar = '';
  const half: string[] = [];
  for (const k of Object.keys(counts)) {
    const c = counts[k]!;
    if (c % 2 === 1) {
      if (oddChar !== '') return []; // 超过一个奇数字符，无法构成
      oddChar = k;
    }
    for (let i = 0; i < Math.floor(c / 2); i++) half.push(k);
  }

  const result: string[] = [];
  const used = new Array<boolean>(half.length).fill(false);
  const perm: string[] = [];

  const backtrack = (): void => {
    if (perm.length === half.length) {
      const left = perm.join('');
      const right = [...left].reverse().join('');
      const full = left + oddChar + right;
      result.push(full);
      hooks.onPerm?.([...perm]);
      hooks.onBuild?.(full);
      return;
    }
    for (let i = 0; i < half.length; i++) {
      if (used[i]) continue;
      // 同层去重：与前一相同元素且前者未用，跳过
      if (i > 0 && half[i] === half[i - 1] && !used[i - 1]) continue;
      used[i] = true;
      perm.push(half[i]!);
      backtrack();
      perm.pop();
      used[i] = false;
    }
  };

  backtrack();
  return result;
}
