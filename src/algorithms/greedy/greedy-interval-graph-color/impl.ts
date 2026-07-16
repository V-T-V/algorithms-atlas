// 区间图着色 · 实现
export interface IgcHooks {
  onEvent?: (t: number, overlap: number) => void;
  onConclude?: (colors: number) => void;
}
export function intervalGraphColor(
  intervals: ReadonlyArray<readonly [number, number]>,
  hooks: IgcHooks = {},
): number {
  const evts: Array<{ t: number; d: number }> = [];
  for (const [s, e] of intervals) {
    evts.push({ t: s, d: 1 });
    evts.push({ t: e, d: -1 });
  }
  evts.sort((a, b) => a.t - b.t || a.d - b.d);
  let cur = 0,
    max = 0;
  for (const ev of evts) {
    cur += ev.d;
    hooks.onEvent?.(ev.t, cur);
    if (cur > max) max = cur;
  }
  hooks.onConclude?.(max);
  return max;
}
