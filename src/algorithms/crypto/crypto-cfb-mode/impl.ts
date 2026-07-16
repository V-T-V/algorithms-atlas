export interface CfbHooks {
  onBlock?: (i: number, out: number[]) => void;
}
export function cfbEncrypt(
  blocks: number[][],
  iv: number[],
  e: (b: number[]) => number[],
  hooks: CfbHooks = {},
): number[][] {
  let prev = iv;
  const out: number[][] = [];
  for (let i = 0; i < blocks.length; i++) {
    const k = e(prev);
    const o = blocks[i]!.map((v, j) => v ^ k[j % k.length]!);
    hooks.onBlock?.(i, o);
    out.push(o);
    prev = o;
  }
  return out;
}
