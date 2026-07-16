// Skipjack · 实现（教学：Rule A 32 轮 16 位子字）
export interface SkipHooks {
  onRound?: (round: number, w: number[]) => void;
}
const F: number[] = Array.from(
  { length: 256 },
  (_, i) => ((i * 0x1f + 0x63) ^ (i << 2) ^ (i >>> 5)) & 0xff,
);
export function skipjackEncrypt(key: number[], block: number[], hooks: SkipHooks = {}): number[] {
  // 80-bit key → 10 字节，扩展为 20 个 16-bit 子密钥（简化循环）
  const K: number[] = [];
  for (let i = 0; i < 10; i++) K.push(((key[i] ?? 0) << 8) | (key[(i + 1) % 10] ?? 0));
  let w0 = (block[0]! << 8) | block[1]!;
  let w1 = (block[2]! << 8) | block[3]!;
  let w2 = (block[4]! << 8) | block[5]!;
  let w3 = (block[6]! << 8) | block[7]!;
  for (let r = 0; r < 32; r++) {
    const k1 = K[(r * 2) % 10]!;
    const k2 = K[(r * 2 + 1) % 10]!;
    const t = w0;
    w0 = (F[w0 & 0xff]! ^ ((w0 >>> 8) & 0xff) ^ (k1 & 0xff) ^ (w1 & 0xff)) & 0xff;
    w0 = ((w0 << 8) | ((F[(t >>> 8) & 0xff]! ^ (k2 & 0xff)) & 0xff)) & 0xffff;
    w0 = (w0 ^ w1) & 0xffff;
    [w0, w1, w2, w3] = [w1, w2, w3, w0];
    hooks.onRound?.(r, [w0, w1, w2, w3]);
  }
  return [
    (w0 >>> 8) & 0xff,
    w0 & 0xff,
    (w1 >>> 8) & 0xff,
    w1 & 0xff,
    (w2 >>> 8) & 0xff,
    w2 & 0xff,
    (w3 >>> 8) & 0xff,
    w3 & 0xff,
  ];
}
