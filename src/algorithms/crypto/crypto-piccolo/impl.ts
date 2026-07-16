export interface PcHooks {
  onRound?: (round: number, s: number[]) => void;
}
export function piccoloEncrypt(key: number[], block: number[], hooks: PcHooks = {}): number[] {
  const s = block.slice(0, 8);
  while (s.length < 8) s.push(0);
  for (let r = 0; r < 25; r++) {
    for (let i = 0; i < 8; i++) s[i] = (s[i]! ^ key[(i + r) % key.length]! ^ r) & 0xff;
    const t = [...s!];
    for (let i = 0; i < 8; i++) s[(i * 3 + r) % 8] = t[i]!;
    hooks.onRound?.(r, s);
  }
  return s;
}
