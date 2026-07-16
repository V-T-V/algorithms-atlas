// Hash DRBG · 实现（简化教学版）

/** 简化哈希：把输入数字序列折叠为一个 32 位整数。 */
function simpleHash(nums: number[]): number {
  let h = 0x811c9dc5;
  for (const x of nums) {
    h ^= x & 0xff;
    h = Math.imul(h, 0x01000193) >>> 0;
    h ^= (x >>> 8) & 0xff;
    h = Math.imul(h, 0x01000193) >>> 0;
    h ^= (x >>> 16) & 0xff;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export class HashDrbg {
  private v: number;
  private readonly c: number;
  private reseedCounter = 1;

  constructor(seed = 0x12345) {
    this.v = simpleHash([seed, 0xdeadbeef]) >>> 0;
    this.c = simpleHash([this.v, 0xcafebabe]) >>> 0;
  }

  nextUint(): number {
    // generate: 返回 H(V)
    const out = simpleHash([this.v]) >>> 0;
    // update V = V + H(V) + C + reseedCounter
    this.v = (this.v + out + this.c + this.reseedCounter) >>> 0;
    this.reseedCounter++;
    return out;
  }

  next(): number {
    return this.nextUint() / 0x100000000;
  }

  sample(n: number): number[] {
    const out: number[] = [];
    for (let i = 0; i < n; i++) out.push(this.next());
    return out;
  }
}

export function hashDrbg(n: number, seed = 0x12345): number[] {
  return new HashDrbg(seed).sample(n);
}
