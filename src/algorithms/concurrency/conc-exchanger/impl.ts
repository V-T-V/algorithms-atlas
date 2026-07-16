export interface ExHooks {
  onSwap?: (a: number, b: number) => void;
}
export function exchanger(
  a: number[],
  b: number[],
  hooks: ExHooks = {},
): { a: number[]; b: number[] } {
  for (let i = 0; i < a.length; i++) {
    const t = a[i]!;
    a[i] = b[i]!;
    b[i] = t;
    hooks.onSwap?.(a[i]!, b[i]!);
  }
  return { a, b };
}
