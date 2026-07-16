// =============================================================================
// Rabin-Karp 滚动哈希 · 纯算法实现
// =============================================================================

export interface RkHooks {
  /** 计算模式串哈希。 */
  onPatternHash?: (h: number) => void;
  /** 滚动到新窗口起点 i，窗口哈希 h。 */
  onWindow?: (i: number, h: number) => void;
  /** 哈希相等，逐字符校验结果。 */
  onVerify?: (i: number, ok: boolean) => void;
  /** 命中。 */
  onFound?: (pos: number) => void;
}

const BASE = 131n; // 大于 ASCII 范围的素数
const MOD = (1n << 61n) - 1n;

function mulMod(a: bigint, b: bigint): bigint {
  return (a * b) % MOD;
}

/** 多项式哈希（BigInt 避免溢出）。 */
export function polyHash(s: string): bigint {
  let h = 0n;
  for (let i = 0; i < s.length; i++) {
    h = (mulMod(h, BASE) + BigInt(s.charCodeAt(i))) % MOD;
  }
  return h;
}

/** Rabin-Karp 匹配：返回所有命中位置。带逐字符校验防冲突。 */
export function rabinKarpSearch(text: string, pat: string, hooks: RkHooks = {}): number[] {
  const n = text.length;
  const m = pat.length;
  if (m === 0) return [0];
  if (m > n) return [];

  const patHash = polyHash(pat);
  hooks.onPatternHash?.(Number(patHash & 0x7fffffffn));

  // 预计算 base^(m-1) mod MOD
  let highestBase = 1n;
  for (let i = 0; i < m - 1; i++) highestBase = mulMod(highestBase, BASE);

  // 初始窗口哈希
  let winHash = polyHash(text.slice(0, m));
  hooks.onWindow?.(0, Number(winHash & 0x7fffffffn));

  const res: number[] = [];
  // 校验函数
  const verify = (start: number): boolean => {
    for (let k = 0; k < m; k++) {
      if (text[start + k] !== pat[k]) return false;
    }
    return true;
  };

  if (winHash === patHash) {
    const ok = verify(0);
    hooks.onVerify?.(0, ok);
    if (ok) {
      res.push(0);
      hooks.onFound?.(0);
    }
  }

  for (let i = 1; i + m <= n; i++) {
    // 滚动：减去 text[i-1]*base^(m-1)，乘 base，加 text[i+m-1]
    const out = BigInt(text.charCodeAt(i - 1));
    const inn = BigInt(text.charCodeAt(i + m - 1));
    winHash = (winHash - mulMod(out, highestBase) + MOD) % MOD;
    winHash = (mulMod(winHash, BASE) + inn) % MOD;
    hooks.onWindow?.(i, Number(winHash & 0x7fffffffn));
    if (winHash === patHash) {
      const ok = verify(i);
      hooks.onVerify?.(i, ok);
      if (ok) {
        res.push(i);
        hooks.onFound?.(i);
      }
    }
  }
  return res;
}
