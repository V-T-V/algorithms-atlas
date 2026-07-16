export type Filter<T> = (input: T) => T;
export interface PfHooks {
  onFilter?: (i: number, input: T_desc, output: T_desc) => void;
}
type T_desc = number[];
export function runPipeline<T>(
  input: T,
  filters: Array<(x: T) => T>,
  hooks: { onFilter?: (i: number, inp: unknown, out: unknown) => void } = {},
): T {
  let cur = input;
  filters.forEach((f, i) => {
    const out = f(cur);
    hooks.onFilter?.(i, cur, out);
    cur = out;
  });
  return cur;
}
