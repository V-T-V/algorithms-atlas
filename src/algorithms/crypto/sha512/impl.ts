// =============================================================================
// SHA-512哈希（SHA-512）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 本实现用 BigInt 处理 64 位字，正确演示 SHA-512 压缩结构。
// =============================================================================

type u64 = bigint;
const MASK64: bigint = (1n << 64n) - 1n;
const u64 = (x: bigint): bigint => x & MASK64;

/** 64 位右循环移位。 */
function rotr64(x: u64, n: number): u64 {
  return u64((x >> BigInt(n)) | (x << BigInt(64 - n)));
}

const K: readonly u64[] = [
  0x428a2f98d728ae22n,
  0x7137449123ef65cdn,
  0xb5c0fbcfec4d3b2fn,
  0xe9b5dba58189dbbcn,
  0x3956c25bf348b538n,
  0x59f111f1b605d019n,
  0x923f82a4af194f9bn,
  0xab1c5ed5da6d8118n,
  0xd807aa98a3030242n,
  0x12835b0145706fben,
  0x243185be4ee4b28cn,
  0x550c7dc3d5ffb4e2n,
  0x72be5d74f27b896fn,
  0x80deb1fe3b1696b1n,
  0x9bdc06a725c71235n,
  0xc19bf174cf692694n,
  0xe49b69c19ef14ad2n,
  0xefbe4786384f25e3n,
  0x0fc19dc68b8cd5b5n,
  0x240ca1cc77ac9c65n,
  0x2de92c6f592b0275n,
  0x4a7484aa6ea6e483n,
  0x5cb0a9dcbd41fbd4n,
  0x76f988da831153b5n,
  0x983e5152ee66dfabn,
  0xa831c66d2db43210n,
  0xb00327c898fb213fn,
  0xbf597fc7beef0ee4n,
  0xc6e00bf33da88fc2n,
  0xd5a79147930aa725n,
  0x06ca6351e003826fn,
  0x142929670a0e6e70n,
  0x27b70a8546d22ffcn,
  0x2e1b21385c26c926n,
  0x4d2c6dfc5ac42aedn,
  0x53380d139d95b3dfn,
  0x650a73548baf63den,
  0x766a0abb3c77b2a8n,
  0x81c2c92e47edaee6n,
  0x92722c851482353bn,
  0xa2bfe8a14cf10364n,
  0xa81a664bbc423001n,
  0xc24b8b70d0f89791n,
  0xc76c51a30654be30n,
  0xd192e819d6ef5218n,
  0xd69906245565a910n,
  0xf40e35855771202an,
  0x106aa07032bbd1b8n,
  0x19a4c116b8d2d0c8n,
  0x1e376c085141ab53n,
  0x2748774cdf8eeb99n,
  0x34b0bcb5e19b48a8n,
  0x391c0cb3c5c95a63n,
  0x4ed8aa4ae3418acbn,
  0x5b9cca4f7763e373n,
  0x682e6ff3d6b2b8a3n,
  0x748f82ee5defb2fcn,
  0x78a5636f43172f60n,
  0x84c87814a1f0ab72n,
  0x8cc702081a6439ecn,
  0x90befffa23631e28n,
  0xa4506cebde82bde9n,
  0xbef9a3f7b2c67915n,
  0xc67178f2e372532bn,
  0xca273eceea26619cn,
  0xd186b8c721c0c207n,
  0xeada7dd6cde0eb1en,
  0xf57d4f7fee6ed178n,
  0x06f067aa72176fban,
  0x0a637dc5a2c898a6n,
  0x113f9804bef90daen,
  0x1b710b35131c471bn,
  0x28db77f523047d84n,
  0x32caab7b40c72493n,
  0x3c9ebe0a15c9bebcn,
  0x431d67c49c100d4cn,
  0x4cc5d4becb3e42b6n,
  0x597f299cfc657e2an,
  0x5fcb6fab3ad6faecn,
  0x6c44198c4a475817n,
];

const shaCh = (x: u64, y: u64, z: u64): u64 => u64((x & y) ^ (~x & z));
const shaMaj = (x: u64, y: u64, z: u64): u64 => u64((x & y) ^ (x & z) ^ (y & z));
const bsig0 = (x: u64): u64 => u64(rotr64(x, 28) ^ rotr64(x, 34) ^ rotr64(x, 39));
const bsig1 = (x: u64): u64 => u64(rotr64(x, 14) ^ rotr64(x, 18) ^ rotr64(x, 41));
const ssig0 = (x: u64): u64 => u64(rotr64(x, 1) ^ rotr64(x, 8) ^ (x >> 7n));
const ssig1 = (x: u64): u64 => u64(rotr64(x, 19) ^ rotr64(x, 61) ^ (x >> 6n));

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface Sha512Hooks {
  /** 第 t 步（0~79）处理后的累加器快照。 */
  onStep?: (t: number, h: bigint[]) => void;
}

export interface Sha512Result {
  /** 64 字节（512 位）摘要。 */
  digest: number[];
}

/**
 * SHA-512：分组 1024 位、80 步压缩，输出 512 位摘要（BigInt 实现）。
 * @param input 消息字节
 * @param hooks 可选的事件钩子
 */
export function sha512(input: number[], hooks: Sha512Hooks = {}): Sha512Result {
  // 1. 填充：补 0x80，补 0x00 至长度 ≡ 112 mod 128，末 16 字节为大端比特长度
  const msg = [...input];
  const bitLen = BigInt(msg.length * 8);
  msg.push(0x80);
  while (msg.length % 128 !== 112) msg.push(0x00);
  for (let i = 15; i >= 0; i--) msg.push(Number((bitLen >> BigInt(i * 8)) & 0xffn));

  let h0 = 0x6a09e667f3bcc908n;
  let h1 = 0xbb67ae8584caa73bn;
  let h2 = 0x3c6ef372fe94f82bn;
  let h3 = 0xa54ff53a5f1d36f1n;
  let h4 = 0x510e527fade682d1n;
  let h5 = 0x9b05688c2b3e6c1fn;
  let h6 = 0x1f83d9abfb41bd6bn;
  let h7 = 0x5be0cd19137e2179n;

  for (let off = 0; off < msg.length; off += 128) {
    const w: u64[] = new Array<u64>(80);
    for (let i = 0; i < 16; i++) {
      let v = 0n;
      for (let b = 0; b < 8; b++) v = (v << 8n) | BigInt(msg[off + i * 8 + b]!);
      w[i] = u64(v);
    }
    for (let i = 16; i < 80; i++) {
      w[i] = u64(ssig1(w[i - 2]!) + w[i - 7]! + ssig0(w[i - 15]!) + w[i - 16]!);
    }

    let [a, b, c, d, e, f, g, h] = [h0, h1, h2, h3, h4, h5, h6, h7];
    for (let t = 0; t < 80; t++) {
      const t1 = u64(h + bsig1(e) + shaCh(e, f, g) + K[t]! + w[t]!);
      const t2 = u64(bsig0(a) + shaMaj(a, b, c));
      h = g;
      g = f;
      f = e;
      e = u64(d + t1);
      d = c;
      c = b;
      b = a;
      a = u64(t1 + t2);
      hooks.onStep?.(t, [a, b, c, d, e, f, g, h]);
    }
    h0 = u64(h0 + a);
    h1 = u64(h1 + b);
    h2 = u64(h2 + c);
    h3 = u64(h3 + d);
    h4 = u64(h4 + e);
    h5 = u64(h5 + f);
    h6 = u64(h6 + g);
    h7 = u64(h7 + h);
  }

  const digest: number[] = [];
  for (const v of [h0, h1, h2, h3, h4, h5, h6, h7]) {
    for (let i = 7; i >= 0; i--) digest.push(Number((v >> BigInt(i * 8)) & 0xffn));
  }
  return { digest };
}
