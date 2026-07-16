// =============================================================================
// SHA-256 · 纯算法实现
// FIPS 180-4 标准的 SHA-256 哈希。用 BigInt 处理 32 位无符号运算。
// =============================================================================

export interface SHA256Hooks {
  /** 每处理一个消息块（512 bit）后触发。 */
  onBlock?: (blockIndex: number, hash: string) => void;
}

const M = 0xffffffffn; // 32 位掩码

/** 常量表 K（前 64 个素数立方根的小数部分 × 2^32）。 */
const K: readonly bigint[] = [
  0x428a2f98n,
  0x71374491n,
  0xb5c0fbcfn,
  0xe9b5dba5n,
  0x3956c25bn,
  0x59f111f1n,
  0x923f82a4n,
  0xab1c5ed5n,
  0xd807aa98n,
  0x12835b01n,
  0x243185ben,
  0x550c7dc3n,
  0x72be5d74n,
  0x80deb1fen,
  0x9bdc06a7n,
  0xc19bf174n,
  0xe49b69c1n,
  0xefbe4786n,
  0x0fc19dc6n,
  0x240ca1ccn,
  0x2de92c6fn,
  0x4a7484aan,
  0x5cb0a9dcn,
  0x76f988dan,
  0x983e5152n,
  0xa831c66dn,
  0xb00327c8n,
  0xbf597fc7n,
  0xc6e00bf3n,
  0xd5a79147n,
  0x06ca6351n,
  0x14292967n,
  0x27b70a85n,
  0x2e1b2138n,
  0x4d2c6dfcn,
  0x53380d13n,
  0x650a7354n,
  0x766a0abbn,
  0x81c2c92en,
  0x92722c85n,
  0xa2bfe8a1n,
  0xa81a664bn,
  0xc24b8b70n,
  0xc76c51a3n,
  0xd192e819n,
  0xd6990624n,
  0xf40e3585n,
  0x106aa070n,
  0x19a4c116n,
  0x1e376c08n,
  0x2748774cn,
  0x34b0bcb5n,
  0x391c0cb3n,
  0x4ed8aa4an,
  0x5b9cca4fn,
  0x682e6ff3n,
  0x748f82een,
  0x78a5636fn,
  0x84c87814n,
  0x8cc70208n,
  0x90befffan,
  0xa4506cebn,
  0xbef9a3f7n,
  0xc67178f2n,
];

const rotr = (x: bigint, n: number): bigint => ((x >> BigInt(n)) | (x << BigInt(32 - n))) & M;

/** 计算 SHA-256 哈希，返回 64 字符 hex 字符串。 */
export function sha256(message: string, hooks: SHA256Hooks = {}): string {
  // 1. 预处理：UTF-8 字节 + padding
  const bytes: number[] = [...new TextEncoder().encode(message)];
  const bitLen = BigInt(bytes.length) * 8n;

  // 2. 补位：追加 0x80，再补 0 直到长度 ≡ 56 (mod 64)，再追加 8 字节长度
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  const lenBytes = [];
  let l = bitLen;
  for (let i = 0; i < 8; i++) {
    lenBytes.unshift(Number(l & 0xffn));
    l >>= 8n;
  }
  bytes.push(...lenBytes);

  // 3. 初始哈希值 H0~H7
  let h0 = 0x6a09e667n,
    h1 = 0xbb67ae85n,
    h2 = 0x3c6ef372n,
    h3 = 0xa54ff53an;
  let h4 = 0x510e527fn,
    h5 = 0x9b05688cn,
    h6 = 0x1f83d9abn,
    h7 = 0x5be0cd19n;

  // 4. 逐块处理
  for (let off = 0; off < bytes.length; off += 64) {
    const w: bigint[] = new Array(64).fill(0n);
    for (let i = 0; i < 16; i++) {
      const b0 = bytes[off + i * 4]!;
      const b1 = bytes[off + i * 4 + 1]!;
      const b2 = bytes[off + i * 4 + 2]!;
      const b3 = bytes[off + i * 4 + 3]!;
      w[i] = (BigInt(b0) << 24n) | (BigInt(b1) << 16n) | (BigInt(b2) << 8n) | BigInt(b3);
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15]!, 7) ^ rotr(w[i - 15]!, 18) ^ (w[i - 15]! >> 3n);
      const s1 = rotr(w[i - 2]!, 17) ^ rotr(w[i - 2]!, 19) ^ (w[i - 2]! >> 10n);
      w[i] = (w[i - 16]! + s0 + w[i - 7]! + s1) & M;
    }

    let a = h0,
      b = h1,
      c = h2,
      d = h3,
      e = h4,
      f = h5,
      g = h6,
      hh = h7;
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (hh + S1 + ch + K[i]! + w[i]!) & M;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) & M;
      hh = g;
      g = f;
      f = e;
      e = (d + temp1) & M;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) & M;
    }

    h0 = (h0 + a) & M;
    h1 = (h1 + b) & M;
    h2 = (h2 + c) & M;
    h3 = (h3 + d) & M;
    h4 = (h4 + e) & M;
    h5 = (h5 + f) & M;
    h6 = (h6 + g) & M;
    h7 = (h7 + hh) & M;

    const hex =
      toHex(h0) + toHex(h1) + toHex(h2) + toHex(h3) + toHex(h4) + toHex(h5) + toHex(h6) + toHex(h7);
    hooks.onBlock?.(off / 64, hex);
  }

  return (
    toHex(h0) + toHex(h1) + toHex(h2) + toHex(h3) + toHex(h4) + toHex(h5) + toHex(h6) + toHex(h7)
  );
}

function toHex(n: bigint): string {
  return n.toString(16).padStart(8, '0');
}
