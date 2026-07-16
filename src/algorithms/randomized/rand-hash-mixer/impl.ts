// 哈希随机混合器 · 纯算法实现
export interface HashMixerHooks {
  onStep?: (input: bigint, output: bigint) => void;
  onResult?: (output: bigint) => void;
}

const MASK64 = (1n << 64n) - 1n;
const GAMMA = 0x9e3779b97f4a7c15n;

/** splitmix64 风格的 64 位混合函数。 */
export function splitMix64(x: bigint, hooks: HashMixerHooks = {}): bigint {
  let z = (x + GAMMA) & MASK64;
  z = ((z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n) & MASK64;
  z = ((z ^ (z >> 27n)) * 0x94d049bb133111ebn) & MASK64;
  z = z ^ (z >> 31n);
  hooks.onStep?.(x & MASK64, z);
  hooks.onResult?.(z);
  return z;
}

/** 从一个种子生成 n 个 64 位伪随机数（递增输入）。 */
export function splitMixStream(seed: bigint, n: number): bigint[] {
  const out: bigint[] = [];
  let s = seed & MASK64;
  for (let i = 0; i < n; i++) {
    s = (s + GAMMA) & MASK64;
    let z = s;
    z = ((z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n) & MASK64;
    z = ((z ^ (z >> 27n)) * 0x94d049bb133111ebn) & MASK64;
    z = z ^ (z >> 31n);
    out.push(z);
  }
  return out;
}
