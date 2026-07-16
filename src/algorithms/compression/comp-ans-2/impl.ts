// ANS 综合演示 v2 · 实现
export interface AnsHooks {
  onEncode?: (sym: number, x: number) => void;
  onResult?: (x: number) => void;
}
export interface AnsFreq {
  sym: number;
  base: number;
  cum: number;
}
/** 编码：x = x * base + cum + sym_offset。 */
export function ansEncode(
  data: number[],
  freq: Map<number, AnsFreq>,
  hooks: AnsHooks = {},
): number {
  let x = 1;
  for (let i = data.length - 1; i >= 0; i--) {
    const f = freq.get(data[i]!)!;
    x = x * f.base + f.cum;
    hooks.onEncode?.(data[i]!, x);
  }
  hooks.onResult?.(x);
  return x;
}
