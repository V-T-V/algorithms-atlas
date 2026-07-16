export interface SssHooks {
  onEmit?: (n: number, code: string) => void;
}
export function sssEncode(
  values: number[],
  start: number,
  step: number,
  stop: number,
  hooks: SssHooks = {},
): string {
  let out = '';
  for (const n of values) {
    let bits = start;
    let lo = 0;
    let i = 0;
    while (i < stop && n >= lo + (1 << bits)) {
      lo += 1 << bits;
      bits += step;
      i++;
    }
    const rem = n - lo;
    const code = '1'.repeat(i) + '0' + rem.toString(2).padStart(bits, '0');
    hooks.onEmit?.(n, code);
    out += code;
  }
  return out;
}
