export interface EcbHooks {
  onBlock?: (i: number, input: number[], out: number[]) => void;
}
export function ecbEncrypt(
  blocks: number[][],
  e: (b: number[]) => number[],
  hooks: EcbHooks = {},
): number[][] {
  return blocks.map((b, i) => {
    const o = e(b);
    hooks.onBlock?.(i, b, o);
    return o;
  });
}
