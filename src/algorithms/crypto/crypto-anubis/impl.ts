export interface AnHooks {
  onRound?: (round: number, state: number[]) => void;
}
export function anubisEncrypt(key: number[], block: number[], hooks: AnHooks = {}): number[] {
  let s = [...block];
  const K = key.length >= 16 ? key.slice(0, 16) : [...key, ...Array(16 - key.length).fill(0)];
  for (let r = 0; r < 8; r++) {
    for (let i = 0; i < 16; i++) s[i] = (s[i]! ^ (K[i]! + r)) & 0xff;
    s = s.map((v) => ((v * 7 + 3) ^ (v >>> 4)) & 0xff);
    const t = [...s];
    for (let i = 0; i < 16; i++) s[(i * 5 + r) % 16] = t[i]!;
    hooks.onRound?.(r, s);
  }
  return s;
}
