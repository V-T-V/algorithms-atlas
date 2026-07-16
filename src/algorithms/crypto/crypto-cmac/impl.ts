export interface CmacHooks {
  onBlock?: (i: number, x: number[]) => void;
  onTag?: (tag: number[]) => void;
}
export function cmacCompute(
  blocks: number[][],
  e: (b: number[]) => number[],
  k1: number[],
  k2: number[],
  hooks: CmacHooks = {},
): number[] {
  let X = new Array(blocks[0]?.length ?? 4).fill(0);
  for (let i = 0; i < blocks.length - 1; i++) {
    X = e(blocks[i]!.map((v, j) => v ^ X[j % X.length]!));
    hooks.onBlock?.(i, X);
  }
  const last = blocks[blocks.length - 1]!;
  const tag = e(last.map((v, j) => v ^ k1[j % k1.length]! ^ X[j % X.length]!));
  hooks.onBlock?.(blocks.length - 1, tag);
  hooks.onTag?.(tag);
  return tag;
}
