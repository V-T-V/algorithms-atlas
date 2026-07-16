// 局部敏感哈希 (SimHash) · 实现
// 投影随机种子（确定性）
export interface SimHashHooks {
  onDim?: (i: number, value: number, projection: number, accum: number) => void;
  onResult?: (hash: bigint, hammingWeight: number) => void;
}

const PROJ_SEED = [13n, 31n, 71n, 137n, 911n, 1723n, 4099n, 8191n, 16381n, 32771n, 65537n, 131071n];
const MASK64 = (1n << 64n) - 1n;

export function simHash(
  vec: readonly number[],
  bits: number = 64,
  hooks: SimHashHooks = {},
): bigint {
  const dim = vec.length;
  if (dim === 0) return 0n;
  let h = 0n;
  let hamming = 0;
  for (let b = 0; b < bits; b++) {
    let acc = 0;
    for (let i = 0; i < dim; i++) {
      // 第 b 位用 b 作种子偏移，得到不同投影
      const proj = ((PROJ_SEED[(b + i) % PROJ_SEED.length]! ^ BigInt(b + 1)) & 1n) === 1n ? 1 : -1;
      acc += proj * vec[i]!;
      hooks.onDim?.(i, vec[i]!, proj, acc);
    }
    if (acc > 0) {
      h = (h | (1n << BigInt(b))) & MASK64;
      hamming++;
    }
  }
  hooks.onResult?.(h, hamming);
  return h;
}

export function hammingDistance(a: bigint, b: bigint): number {
  let x = a ^ b;
  let count = 0;
  while (x > 0n) {
    count += Number(x & 1n);
    x >>= 1n;
  }
  return count;
}
