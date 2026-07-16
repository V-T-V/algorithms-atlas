export interface TbHooks {
  onEmit?: (v: number, bits: string) => void;
}
export function truncatedBinaryEncode(values: number[], n: number, hooks: TbHooks = {}): string {
  const k = Math.floor(Math.log2(n));
  const u = 1 << k;
  const v = n - u;
  let out = '';
  for (const x of values) {
    let code: string;
    if (x < 2 * v) code = x.toString(2).padStart(k + 1, '0');
    else code = (x + v).toString(2).padStart(k, '0');
    hooks.onEmit?.(x, code);
    out += code;
  }
  return out;
}
