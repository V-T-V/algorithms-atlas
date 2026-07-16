export interface TvHooks {
  onBit?: (i: number, bit: number) => void;
}
export function trivium(key: number[], iv: number[], nBits: number, hooks: TvHooks = {}): number[] {
  const s: number[] = new Array(288).fill(0);
  for (let i = 0; i < 80; i++) s[i] = (key[Math.floor(i / 8)]! >> (i % 8)) & 1;
  for (let i = 0; i < 80; i++) s[93 + i] = (iv[Math.floor(i / 8)]! >> (i % 8)) & 1;
  s[285] = s[286] = s[287] = 1;
  const out: number[] = [];
  for (let i = 0; i < 1152 + nBits; i++) {
    const t1 = s[65]! ^ s[92]!;
    const t2 = s[161]! ^ s[176]!;
    const t3 = s[242]! ^ s[287]!;
    if (i >= 1152) {
      out.push(t1 ^ t2 ^ t3);
      hooks.onBit?.(i - 1152, t1 ^ t2 ^ t3);
    }
    const o1 = s[90]! & s[91]!;
    const o2 = s[174]! & s[175]!;
    const o3 = s[285]! & s[286]!;
    s.pop();
    s.splice(176, 0, (t3 ^ o3) & 1);
    s.pop();
    s.splice(93, 0, (t2 ^ o2) & 1);
    s.pop();
    s.splice(0, 0, (t1 ^ o1) & 1);
  }
  return out;
}
