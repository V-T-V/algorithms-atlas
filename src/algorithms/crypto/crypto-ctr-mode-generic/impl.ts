export interface CtrHooks {
  onBlock?: (i: number, counter: number[], out: number[]) => void;
}
export function ctrEncrypt(
  blocks: number[][],
  nonce: number[],
  e: (b: number[]) => number[],
  hooks: CtrHooks = {},
): number[][] {
  const out: number[][] = [];
  for (let i = 0; i < blocks.length; i++) {
    const ctr = [...nonce];
    ctr[ctr.length - 1] = (ctr[ctr.length - 1]! + i) & 0xff;
    const ks = e(ctr);
    const o = blocks[i]!.map((v, j) => v ^ ks[j % ks.length]!);
    hooks.onBlock?.(i, ctr, o);
    out.push(o);
  }
  return out;
}
