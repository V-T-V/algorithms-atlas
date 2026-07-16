export interface OfbHooks {
  onBlock?: (i: number, keystream: number[], out: number[]) => void;
}
export function ofbEncrypt(
  blocks: number[][],
  iv: number[],
  e: (b: number[]) => number[],
  hooks: OfbHooks = {},
): number[][] {
  let sr = iv;
  const out: number[][] = [];
  for (let i = 0; i < blocks.length; i++) {
    sr = e(sr);
    const o = blocks[i]!.map((v, j) => v ^ sr[j % sr.length]!);
    hooks.onBlock?.(i, sr, o);
    out.push(o);
  }
  return out;
}
