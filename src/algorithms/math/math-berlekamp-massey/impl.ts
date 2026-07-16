// =============================================================================
// Berlekamp-Massey · 模素数域（连接多项式形式）
// 返回 c[0..k-1] 使得 s[i] = sum_{j=0..k-1} c[j] * s[i-1-j] mod MOD
// =============================================================================

const MOD = 1_000_000_007n;

function modPow(base: bigint, exp: number, m: bigint): bigint {
  let b = base % m;
  let e = exp;
  let r = 1n;
  while (e > 0) {
    if (e & 1) r = (r * b) % m;
    b = (b * b) % m;
    e = Math.floor(e / 2);
  }
  return r;
}

function modInv(a: bigint, m: bigint): bigint {
  return modPow(((a % m) + m) % m, Number(m - 2n), m);
}

export interface BerlekampMasseyHooks {
  onUpdate?: (index: number, discrepancy: bigint, newLength: number) => void;
}

export function berlekampMassey(
  seq: number[] | bigint[],
  hooks: BerlekampMasseyHooks = {},
): bigint[] {
  const s = seq.map((x) => ((BigInt(x) % MOD) + MOD) % MOD);
  let cur: bigint[] = []; // 当前连接多项式 c_1..c_k
  let prev: bigint[] = []; // 上一次失败时的连接多项式
  let lastFail = 0; // 上次失败的索引
  let lastFailDelta = 1n; // 上次失败的差值

  for (let i = 0; i < s.length; i++) {
    // 计算 discrepancy: t = sum_{j} cur[j] * s[i-1-j]
    let t = 0n;
    for (let j = 0; j < cur.length; j++) {
      t = (t + cur[j]! * s[i - 1 - j]!) % MOD;
    }
    const d = (((s[i]! - t) % MOD) + MOD) % MOD;
    if (d === 0n) continue;

    if (cur.length === 0) {
      // 首次失败：当前序列前缀无法用空递推表示
      cur = new Array<bigint>(i + 1).fill(0n);
      lastFail = i;
      lastFailDelta = d;
      hooks.onUpdate?.(i, d, cur.length);
      continue;
    }
    const k = (d * modInv(lastFailDelta, MOD)) % MOD;
    // 新连接多项式：cur + (i - lastFail - 1) 个 0 + k, 然后减去 k*prev 平移
    // c = [0]*(i - lastFail - 1) + [k] + [-k*p for p in prev]
    const offset = i - lastFail - 1;
    const newC: bigint[] = [];
    // 与 cur 长度对齐
    const needLen = Math.max(cur.length, prev.length + 1 + offset);
    for (let idx = 0; idx < needLen; idx++) newC.push(0n);
    for (let idx = 0; idx < cur.length; idx++) newC[idx] = cur[idx]!;
    // 在位置 offset 处加 k
    newC[offset] = (newC[offset]! + k) % MOD;
    // 减去 k*prev[j] 放到 offset+1+j
    for (let j = 0; j < prev.length; j++) {
      const pos = offset + 1 + j;
      newC[pos] = ((((newC[pos]! ?? 0n) - k * prev[j]!) % MOD) + MOD) % MOD;
    }
    // 更新 prev / lastFail / delta（只有当新的更长时才记录）
    if (i - cur.length > lastFail - prev.length) {
      prev = cur;
      lastFail = i;
      lastFailDelta = d;
    }
    cur = newC;
    // 去除尾部零
    while (cur.length > 0 && cur[cur.length - 1] === 0n) cur.pop();
    hooks.onUpdate?.(i, d, cur.length);
  }
  return cur;
}
