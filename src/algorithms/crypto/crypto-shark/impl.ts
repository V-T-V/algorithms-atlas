export interface ShkHooks {
  onRound?: (round: number, state: number[]) => void;
}
export function sharkEncrypt(key: number[], block: number[], hooks: ShkHooks = {}): number[] {
  let s = [...block];
  for (let r = 0; r < 6; r++) {
    s = s.map((v, i) => (v ^ key[(i + r) % key.length]!) & 0xff);
    s = s.map((v) => ((v << 1) ^ ((v >> 7) * 0x1b)) & 0xff);
    hooks.onRound?.(r, s);
  }
  return s;
}
