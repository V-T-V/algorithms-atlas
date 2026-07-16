// SipHash-2-4 (简化 32 位输出) · 实现
export interface SipHooks {
  onBlock?: (i: number, m: number) => void;
  onConclude?: (hash: number) => void;
}
function rotl(x: number, r: number): number {
  return (x << r) | (x >>> (32 - r));
}
export function sipHash(
  data: string,
  key: [number, number] = [0x01234567, 0x89abcdef],
  hooks: SipHooks = {},
): number {
  let v0 = key[0] ^ 0xdeadbeef,
    v1 = key[1] ^ 0xfeedface,
    v2 = key[0] ^ 0xcafebabe,
    v3 = key[1] ^ 0x0badcafe;
  const round = () => {
    v0 = (v0 + v1) | 0;
    v1 = rotl(v1, 5);
    v1 = (v1 ^ v0) | 0;
    v0 = rotl(v0, 16);
    v2 = (v2 + v3) | 0;
    v3 = rotl(v3, 8);
    v3 = (v3 ^ v2) | 0;
    v0 = (v0 + v3) | 0;
    v3 = rotl(v3, 7);
    v3 = (v3 ^ v0) | 0;
    v2 = (v2 + v1) | 0;
    v1 = rotl(v1, 13);
    v1 = (v1 ^ v2) | 0;
    v2 = rotl(v2, 16);
  };
  for (let i = 0; i < data.length; i += 4) {
    let m = 0;
    for (let j = 0; j < 4 && i + j < data.length; j++) m |= data.charCodeAt(i + j) << (j * 8);
    v3 ^= m;
    round();
    round();
    v0 ^= m;
    hooks.onBlock?.(i, m);
  }
  const b = data.length << 24;
  v3 ^= b;
  round();
  round();
  v0 ^= b;
  v2 ^= 0xff;
  round();
  round();
  round();
  round();
  const out = (v0 ^ v1 ^ v2 ^ v3) >>> 0;
  hooks.onConclude?.(out);
  return out;
}
