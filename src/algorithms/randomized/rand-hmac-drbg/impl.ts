// HMAC DRBG · 实现（简化教学版）

/** 简化 HMAC：HMAC(K, M) = hash((K ^ opad) || hash((K ^ ipad) || M)) */
function simpleHash(x: number): number {
  let h = x >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35) >>> 0;
  return (h ^ (h >>> 16)) >>> 0;
}

function hmac(k: number, m: number): number {
  return simpleHash(k ^ 0x5c5c5c5c ^ simpleHash(k ^ 0x36363636 ^ m));
}

export class HmacDrbg {
  private k: number;
  private v: number;

  constructor(seed = 0) {
    this.k = 0;
    this.v = 0;
    // 初始化：K = HMAC(K, V||0x00||seed); V = HMAC(K, V)
    this.k = hmac(this.k, this.v ^ 0x00 ^ seed);
    this.v = hmac(this.k, this.v);
  }

  nextUint(): number {
    // V = HMAC(K, V), 输出 V
    this.v = hmac(this.k, this.v);
    const out = this.v;
    // 更新
    this.k = hmac(this.k, this.v ^ 0x00);
    this.v = hmac(this.k, this.v);
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

export function hmacDrbg(n: number, seed = 0): number[] {
  return new HmacDrbg(seed).sample(n);
}
