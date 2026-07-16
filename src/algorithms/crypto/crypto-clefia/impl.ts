export interface ClHooks {
  onRound?: (round: number, s: number[]) => void;
}
export function clefiaEncrypt(key: number[], block: number[], hooks: ClHooks = {}): number[] {
  const s = block.slice(0, 16);
  while (s.length < 16) s.push(0);
  for (let r = 0; r < 16; r++) {
    for (let i = 0; i < 16; i++) s[i] = (s[i]! ^ key[(i + r) % key.length]!) & 0xff;
    const t = [...s!];
    for (let i = 0; i < 16; i++) s[(i * 4 + r) % 16] = t[i]!;
    hooks.onRound?.(r, s);
  }
  return s;
}
