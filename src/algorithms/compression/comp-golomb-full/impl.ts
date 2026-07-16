export interface GolHooks {
  onEmit?: (n: number, code: string) => void;
}
export function golombEncode(values: number[], m: number, hooks: GolHooks = {}): string {
  const b = Math.floor(Math.log2(m));
  const useTrunc = m !== Math.pow(2, b);
  let out = '';
  for (const n of values) {
    const q = Math.floor(n / m);
    const r = n % m;
    let code = '1'.repeat(q) + '0';
    if (!useTrunc) {
      code += r.toString(2).padStart(b, '0');
    } else {
      const larger = m - Math.pow(2, b);
      if (r < larger) code += r.toString(2).padStart(b - 1, '0');
      else code += (r + larger).toString(2).padStart(b, '0');
    }
    hooks.onEmit?.(n, code);
    out += code;
  }
  return out;
}
