// =============================================================================
// Rabin-Karp：滚动哈希匹配（单 mod，匹配后再字符校验）
// =============================================================================

const BASE = 131;
const MOD = 1_000_000_007;

export interface RkHooks {
  onHash?: (i: number, hash: number) => void;
  onRoll?: (i: number, hash: number) => void;
  onCandidate?: (i: number) => void;
  onFound?: (start: number) => void;
}

export function rabinKarp(text: string, pat: string, hooks: RkHooks = {}): number[] {
  const n = text.length;
  const m = pat.length;
  if (m === 0 || m > n) return [];
  // 计算模式哈希
  let patHash = 0;
  for (let i = 0; i < m; i++) {
    patHash = (patHash * BASE + text.charCodeAt(0)) | 0; // 占位
  }
  patHash = 0;
  for (let i = 0; i < m; i++) {
    patHash = (patHash * BASE + pat.charCodeAt(i)) % MOD;
  }
  hooks.onHash?.(-1, patHash);

  // 最高位权重
  let high = 1;
  for (let i = 0; i < m - 1; i++) high = (high * BASE) % MOD;

  // 初始窗口哈希
  let winHash = 0;
  for (let i = 0; i < m; i++) {
    winHash = (winHash * BASE + text.charCodeAt(i)) % MOD;
  }
  hooks.onHash?.(0, winHash);

  const result: number[] = [];
  for (let i = 0; i + m <= n; i++) {
    if (winHash === patHash) {
      hooks.onCandidate?.(i);
      // 字符级确认
      let ok = true;
      for (let k = 0; k < m; k++) {
        if (text[i + k] !== pat[k]) {
          ok = false;
          break;
        }
      }
      if (ok) {
        hooks.onFound?.(i);
        result.push(i);
      }
    }
    // 滚动
    if (i + m < n) {
      const out = (text.charCodeAt(i) * high) % MOD;
      winHash = (winHash - out + MOD) % MOD;
      winHash = (winHash * BASE) % MOD;
      winHash = (winHash + text.charCodeAt(i + m)) % MOD;
      hooks.onRoll?.(i + 1, winHash);
    }
  }
  return result;
}
