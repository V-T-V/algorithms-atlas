// =============================================================================
// 整数划分（五边形数定理）
// =============================================================================

const MOD = 1_000_000_007n;

export interface PartitionHooks {
  onValue?: (n: number, value: bigint) => void;
  onDone?: (values: bigint[]) => void;
}

export function partitionTable(maxN: number, hooks: PartitionHooks = {}): bigint[] {
  const p = new Array<bigint>(maxN + 1).fill(0n);
  p[0] = 1n;
  for (let i = 1; i <= maxN; i++) {
    let sum = 0n;
    for (let k = 1; ; k++) {
      const pent1 = (k * (3 * k - 1)) / 2;
      const pent2 = (k * (3 * k + 1)) / 2;
      const sign = k % 2 === 1 ? 1n : -1n;
      if (pent1 > i) break;
      sum = (sum + sign * p[i - pent1]!) % MOD;
      if (pent2 <= i) sum = (sum + sign * p[i - pent2]!) % MOD;
    }
    p[i] = ((sum % MOD) + MOD) % MOD;
    hooks.onValue?.(i, p[i]!);
  }
  hooks.onDone?.(p);
  return p;
}

export function partitionNumber(n: number): bigint {
  return partitionTable(n)[n]!;
}
