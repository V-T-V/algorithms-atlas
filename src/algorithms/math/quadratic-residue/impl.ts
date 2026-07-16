// =============================================================================
// 二次剩余判定与枚举 · 纯算法实现
// =============================================================================

/** 事件钩子。 */
export interface QuadraticResidueHooks {
  /** 枚举到平方 x² mod p = r。 */
  onSquare?: (x: bigint, r: bigint) => void;
  /** 完成枚举，给出排序去重的剩余集合。 */
  onDone?: (residues: bigint[]) => void;
}

function powMod(base: bigint, exp: bigint, m: bigint): bigint {
  let b = ((base % m) + m) % m;
  let e = exp;
  let r = 1n % m;
  while (e > 0n) {
    if (e & 1n) r = (r * b) % m;
    b = (b * b) % m;
    e >>= 1n;
  }
  return r;
}

/** 判定 a 是否为模奇素数 p 的二次剩余。 */
export function isQuadraticResidue(a: number | bigint, p: number | bigint): boolean {
  const aa = typeof a === 'number' ? BigInt(a) : a;
  const pp = typeof p === 'number' ? BigInt(p) : p;
  const norm = ((aa % pp) + pp) % pp;
  if (norm === 0n) return true; // 约定 0 视为剩余
  return powMod(norm, (pp - 1n) / 2n, pp) === 1n;
}

/**
 * 枚举模奇素数 p 的全部（非零）二次剩余，升序返回。
 */
export function enumerateResidues(p: number | bigint, hooks: QuadraticResidueHooks = {}): bigint[] {
  const pp = typeof p === 'number' ? BigInt(p) : p;
  const set = new Set<bigint>();
  for (let x = 1n; x < pp; x++) {
    const r = (x * x) % pp;
    if (!set.has(r)) {
      set.add(r);
      hooks.onSquare?.(x, r);
    }
  }
  const residues = [...set].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  hooks.onDone?.(residues);
  return residues;
}
