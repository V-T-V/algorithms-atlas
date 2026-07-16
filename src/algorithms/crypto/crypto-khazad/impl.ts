export interface KhHooks {
  onRound?: (round: number, state: number[]) => void;
}
export function khazadEncrypt(key: number[], block: number[], hooks: KhHooks = {}): number[] {
  let s = [...block];
  for (let r = 0; r < 8; r++) {
    for (let i = 0; i < 8; i++) s[i] = (s[i]! ^ (key[i % key.length]! + r)) & 0xff;
    s = s.map((v) => ((v * 11 + 5) ^ (v >>> 3)) & 0xff);
    const t = [...s];
    for (let i = 0; i < 8; i++) s[(i * 3 + r) % 8] = t[i]!;
    hooks.onRound?.(r, s);
  }
  return s;
}
