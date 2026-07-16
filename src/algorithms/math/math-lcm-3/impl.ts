// =============================================================================
// 多元素 LCM
// =============================================================================

import { binaryGcd } from '../math-gcd-3/impl.ts';

export interface LcmHooks {
  onPair?: (a: bigint, b: bigint, lcm: bigint) => void;
  onDone?: (lcm: bigint) => void;
}

function gcd(a: bigint, b: bigint): bigint {
  return binaryGcd(a, b);
}

export function lcm(a: number | bigint, b: number | bigint): bigint {
  const A = typeof a === 'bigint' ? a : BigInt(a);
  const B = typeof b === 'bigint' ? b : BigInt(b);
  if (A === 0n || B === 0n) return 0n;
  const g = gcd(A < 0n ? -A : A, B < 0n ? -B : B);
  const r = (A / g) * B;
  return r < 0n ? -r : r;
}

export function lcmMulti(nums: readonly (number | bigint)[], hooks: LcmHooks = {}): bigint {
  if (nums.length === 0) return 1n;
  let acc = typeof nums[0] === 'bigint' ? (nums[0] as bigint) : BigInt(nums[0] as number);
  for (let i = 1; i < nums.length; i++) {
    const cur = lcm(acc, nums[i]!);
    hooks.onPair?.(
      acc,
      typeof nums[i] === 'bigint' ? (nums[i] as bigint) : BigInt(nums[i] as number),
      cur,
    );
    acc = cur;
  }
  hooks.onDone?.(acc);
  return acc;
}
