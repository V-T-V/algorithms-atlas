// IDEA · 实现（教学简化：模 2^16 运算 + 4 轮）
export interface IdeaHooks {
  onRound?: (round: number, vals: number[]) => void;
}
function mulMod(a: number, b: number): number {
  if (a === 0) a = 0x10000;
  if (b === 0) b = 0x10000;
  const r = (a * b) % 0x10001;
  return r === 0x10000 ? 0 : r & 0xffff;
}
function addMod(a: number, b: number): number {
  return (a + b) & 0xffff;
}
export function ideaEncrypt(key: number[], block: number[], hooks: IdeaHooks = {}): number[] {
  const K: number[] = [];
  for (let i = 0; i < 8; i++) K.push(((key[i * 2] ?? 0) << 8) | (key[i * 2 + 1] ?? 0));
  let [x1, x2, x3, x4] = [
    (block[0]! << 8) | block[1]!,
    (block[2]! << 8) | block[3]!,
    (block[4]! << 8) | block[5]!,
    (block[6]! << 8) | block[7]!,
  ];
  for (let r = 0; r < 4; r++) {
    const k = K.slice((r * 6) % 8, ((r * 6) % 8) + 6);
    while (k.length < 6) k.push(K[(r * 6 + k.length) % 8]!);
    x1 = mulMod(x1, k[0]!);
    x2 = addMod(x2, k[1]!);
    x3 = addMod(x3, k[2]!);
    x4 = mulMod(x4, k[3]!);
    const s1 = x1 ^ x3;
    const s2 = x2 ^ x4;
    const t1 = mulMod(s1, k[4]!);
    const t2 = addMod(s2, t1);
    const t3 = mulMod(t2, k[5]!);
    const t4 = addMod(t1, t3);
    x1 ^= t3;
    x2 ^= t4;
    x3 ^= t3;
    x4 ^= t4;
    [x2, x3] = [x3, x2];
    hooks.onRound?.(r, [x1, x2, x3, x4]);
  }
  return [
    (x1 >>> 8) & 0xff,
    x1 & 0xff,
    (x2 >>> 8) & 0xff,
    x2 & 0xff,
    (x3 >>> 8) & 0xff,
    x3 & 0xff,
    (x4 >>> 8) & 0xff,
    x4 & 0xff,
  ];
}
