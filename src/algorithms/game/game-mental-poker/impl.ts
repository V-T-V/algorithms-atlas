// 心理扑克 · 实现 (交换式加密模拟)
export interface MpHooks {
  onEncrypt?: (player: string, card: number, ct: number) => void;
  onDecrypt?: (player: string, card: number, ct: number) => void;
  onDeal?: (hand: number[]) => void;
}
// 用模乘模拟交换加密: E_k(x) = x^k mod p
export function mentalPoker(
  deckSize: number,
  p: number,
  keyA: number,
  keyB: number,
  hooks: MpHooks = {},
): number[] {
  const deck = Array.from({ length: deckSize }, (_, i) => i + 1);
  // A 加密
  const encA = deck.map((c) => {
    const ct = modPow(c, keyA, p);
    hooks.onEncrypt?.('A', c, ct);
    return ct;
  });
  // B 加密
  const encAB = encA.map((c) => {
    const ct = modPow(c, keyB, p);
    hooks.onEncrypt?.('B', c, ct);
    return ct;
  });
  // 洗牌
  for (let i = encAB.length - 1; i > 0; i--) {
    const j = (i * 7 + 3) % (i + 1);
    [encAB[i], encAB[j]] = [encAB[j]!, encAB[i]!];
  }
  // A 取两张并发给 B 的部分解密
  const hand = encAB.slice(0, 2).map((c) => {
    const decB = modPow(c, modInv(keyB, p - 1), p);
    hooks.onDecrypt?.('B', c, decB);
    return decB;
  });
  hooks.onDeal?.(hand);
  return hand;
}
function modPow(b: number, e: number, m: number): number {
  let r = 1;
  b = b % m;
  while (e > 0) {
    if (e % 2 === 1) r = (r * b) % m;
    e = Math.floor(e / 2);
    b = (b * b) % m;
  }
  return r;
}
function modInv(a: number, m: number): number {
  a = ((a % m) + m) % m;
  for (let x = 1; x < m; x++) if ((a * x) % m === 1) return x;
  return 1;
}
