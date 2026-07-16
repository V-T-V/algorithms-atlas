export interface TwHooks {
  onRound?: (round: number, state: number[]) => void;
}
export function threeWayEncrypt(key: number[], block: number[], hooks: TwHooks = {}): number[] {
  let s = [...block];
  for (let r = 0; r < 12; r++) {
    for (let i = 0; i < 12; i++) s[i] = (s[i]! ^ key[i % key.length]! ^ r) & 0xff;
    s = s.map((v) => ((v >>> 1) | ((v & 1) << 7)) & 0xff);
    hooks.onRound?.(r, s);
  }
  return s;
}
