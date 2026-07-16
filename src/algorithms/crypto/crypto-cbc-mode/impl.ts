export interface CbcHooks {
  onBlock?: (i: number, xored: number[], out: number[]) => void;
}
export function cbcEncrypt(
  blocks: number[][],
  iv: number[],
  e: (b: number[]) => number[],
  hooks: CbcHooks = {},
): number[][] {
  let prev = iv;
  const out: number[][] = [];
  for (let i = 0; i < blocks.length; i++) {
    const x = blocks[i]!.map((v, j) => v ^ prev[j % prev.length]!);
    const o = e(x);
    hooks.onBlock?.(i, x, o);
    out.push(o);
    prev = o;
  }
  return out;
}
