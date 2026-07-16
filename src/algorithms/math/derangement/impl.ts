// =============================================================================
// 错排数（Derangement）· 纯算法实现
// D(n) = n 个元素的全排列中，每个元素都不在原位置（无不动点）的排列数。
//   递推：D(n) = (n-1) * (D(n-1) + D(n-2))，D(0)=1, D(1)=0。
//   闭式：D(n) = n! * Σ_{k=0}^{n} (-1)^k / k!。
// 支持取模（大数）与精确 BigInt 两种模式。
// =============================================================================

export interface DerangementHooks {
  onStep?: (n: number, val: number) => void;
  onResult?: (val: number) => void;
}

/** 小整数错排数（取 mod）。 */
export function derangementMod(n: number, mod: number, hooks: DerangementHooks = {}): number {
  if (n < 0) {
    hooks.onResult?.(0);
    return 0;
  }
  if (n === 0) {
    hooks.onStep?.(0, 1 % mod);
    hooks.onResult?.(1 % mod);
    return 1 % mod;
  }
  if (n === 1) {
    hooks.onStep?.(1, 0);
    hooks.onResult?.(0);
    return 0;
  }
  let d0 = 1 % mod;
  let d1 = 0;
  hooks.onStep?.(0, d0);
  hooks.onStep?.(1, d1);
  let cur = 0;
  for (let k = 2; k <= n; k++) {
    cur = (((k - 1) % mod) * ((d1 + d0) % mod)) % mod;
    d0 = d1;
    d1 = cur;
    hooks.onStep?.(k, cur);
  }
  hooks.onResult?.(cur);
  return cur;
}

/** 精确错排数（BigInt）。 */
export function derangementBig(n: number, hooks: DerangementHooks = {}): bigint {
  if (n < 0) {
    hooks.onResult?.(0);
    return 0n;
  }
  if (n === 0) {
    hooks.onResult?.(1);
    return 1n;
  }
  if (n === 1) {
    hooks.onResult?.(0);
    return 0n;
  }
  let d0 = 1n;
  let d1 = 0n;
  let cur = 0n;
  for (let k = 2n; k <= BigInt(n); k++) {
    cur = (k - 1n) * (d1 + d0);
    d0 = d1;
    d1 = cur;
  }
  hooks.onResult?.(Number(cur));
  return cur;
}

/** 小整数错排数（不取模，仅适用于 n<20 左右避免溢出）。 */
export function derangement(n: number, hooks: DerangementHooks = {}): number {
  if (n < 0) {
    hooks.onResult?.(0);
    return 0;
  }
  if (n === 0) {
    hooks.onResult?.(1);
    return 1;
  }
  if (n === 1) {
    hooks.onResult?.(0);
    return 0;
  }
  let d0 = 1;
  let d1 = 0;
  let cur = 0;
  hooks.onStep?.(0, d0);
  hooks.onStep?.(1, d1);
  for (let k = 2; k <= n; k++) {
    cur = (k - 1) * (d1 + d0);
    d0 = d1;
    d1 = cur;
    hooks.onStep?.(k, cur);
  }
  hooks.onResult?.(cur);
  return cur;
}
