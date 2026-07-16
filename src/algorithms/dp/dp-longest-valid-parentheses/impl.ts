// =============================================================================
// 最长有效括号·DP
// dp[i] = 以 s[i] 结尾的最长有效子串长度。
// 1) s[i]=')' & s[i-1]='(': dp[i]=dp[i-2]+2
// 2) s[i]=')' & s[i-1]=')' & s[i-dp[i-1]-1]='(': dp[i]=dp[i-1]+2+dp[i-dp[i-1]-2]
// =============================================================================

export interface LvpHooks {
  onChar?: (i: number, value: number) => void;
  onResult?: (maxLen: number, endIndex: number) => void;
}

export interface LvpResult {
  maxLen: number;
  endIndex: number;
  dp: number[];
}

export function longestValidParentheses(s: string, hooks: LvpHooks = {}): LvpResult {
  const n = s.length;
  if (n === 0) {
    hooks.onResult?.(0, -1);
    return { maxLen: 0, endIndex: -1, dp: [] };
  }
  const dp = new Array<number>(n).fill(0);
  let maxLen = 0;
  let endIndex = -1;

  for (let i = 1; i < n; i++) {
    if (s[i] !== ')') {
      hooks.onChar?.(i, 0);
      continue;
    }
    if (s[i - 1] === '(') {
      dp[i] = (dp[i - 2] ?? 0) + 2;
    } else if (s[i - 1] === ')') {
      const inner = dp[i - 1]!;
      const j = i - inner - 1;
      if (j >= 0 && s[j] === '(') {
        dp[i] = inner + 2 + (dp[j - 1] ?? 0);
      }
    }
    hooks.onChar?.(i, dp[i]!);
    if (dp[i]! > maxLen) {
      maxLen = dp[i]!;
      endIndex = i;
    }
  }

  hooks.onResult?.(maxLen, endIndex);
  return { maxLen, endIndex, dp };
}
