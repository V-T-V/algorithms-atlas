export interface SqHooks {
  onRound?: (round: number, state: number[]) => void;
}
export function squareEncrypt(key: number[], block: number[], hooks: SqHooks = {}): number[] {
  let s = [...block];
  for (let r = 0; r < 8; r++) {
    s = s.map((v, i) => (v ^ key[i % key.length]!) & 0xff);
    s = s.map((v) => ((v * 5 + 7) ^ r) & 0xff);
    const t = [...s];
    for (let i = 0; i < 16; i++) s[(i * 7 + r) % 16] = t[i]!;
    hooks.onRound?.(r, s);
  }
  return s;
}
