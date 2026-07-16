// AES-GCM · 实现（简化：CTR + GHASH over GF(2^128)，自带 toy block cipher）
export interface GcmHooks {
  onCtr?: (counter: number[], ks: number[]) => void;
  onGhash?: (acc: bigint) => void;
  onTag?: (tag: number[]) => void;
}
// 自带教学 16 字节块加密（toy：基于密钥的伪随机置换，非真实 AES）
function blockEnc(key: number[], blk: number[]): number[] {
  const out = blk.slice();
  for (let r = 0; r < 4; r++) {
    for (let i = 0; i < 16; i++)
      out[i] = ((out[i]! + key[(i + r) % key.length]! + r * 0x11) ^ (out[i]! << 1)) & 0xff;
    for (let i = 0; i < 16; i++) out[i] = out[i]! ^ out[(i + 7) % 16]!;
  }
  return out;
}
// GF(2^128) 乘法，使用 reversed-bit 表示
function gfMul(x: bigint, y: bigint): bigint {
  const R = 0xe1000000000000000000000000000000n;
  let z = 0n;
  for (let i = 0; i < 128; i++) {
    if ((y >> BigInt(i)) & 1n) z ^= x;
    const lsb = x & 1n;
    x >>= 1n;
    if (lsb) x ^= R;
  }
  return z;
}
function bytesToBig(b: number[]): bigint {
  let v = 0n;
  for (const x of b) v = (v << 8n) | BigInt(x);
  return v;
}
function bigToBytes(v: bigint, n: number): number[] {
  const out: number[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(Number((v >> BigInt(i * 8)) & 0xffn));
  return out;
}
export function gcmEncrypt(
  key: number[],
  iv: number[],
  plaintext: number[],
  aad: number[] = [],
  hooks: GcmHooks = {},
): { ciphertext: number[]; tag: number[] } {
  const H = blockEnc(key, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const j0 = [...iv, 0, 0, 0, 1];
  const eJ0 = blockEnc(key, j0);
  const ciphertext: number[] = [];
  const counter = j0.slice();
  for (let i = 0; i < plaintext.length; i += 16) {
    for (let k = 15; k >= 12; k--) {
      counter[k] = (counter[k]! + 1) & 0xff;
      if (counter[k] !== 0) break;
    }
    const ks = blockEnc(key, counter);
    hooks.onCtr?.([...counter], ks);
    for (let k = 0; k < 16 && i + k < plaintext.length; k++)
      ciphertext.push(plaintext[i + k]! ^ ks[k]!);
  }
  let acc = 0n;
  const ghashBlock = (blk: number[]) => {
    acc ^= bytesToBig(blk);
    acc = gfMul(acc, bytesToBig(H));
    hooks.onGhash?.(acc);
  };
  for (let i = 0; i < aad.length; i += 16)
    ghashBlock([
      ...aad.slice(i, i + 16),
      ...Array(16 - (Math.min(i + 16, aad.length) - i)).fill(0),
    ]);
  for (let i = 0; i < ciphertext.length; i += 16)
    ghashBlock([
      ...ciphertext.slice(i, i + 16),
      ...Array(16 - (Math.min(i + 16, ciphertext.length) - i)).fill(0),
    ]);
  ghashBlock([
    ...bigToBytes(BigInt(aad.length) * 8n, 8),
    ...bigToBytes(BigInt(ciphertext.length) * 8n, 8),
  ]);
  const tagBig = acc ^ bytesToBig(eJ0);
  const tag = bigToBytes(tagBig, 16);
  hooks.onTag?.(tag);
  return { ciphertext, tag };
}
