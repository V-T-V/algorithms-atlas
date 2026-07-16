export interface GvbHooks {
  onGroup?: (tag: number, sizes: number[]) => void;
}
export function groupVarintEncode(values: number[], hooks: GvbHooks = {}): number[] {
  const out: number[] = [];
  for (let i = 0; i < values.length; i += 4) {
    const group = values.slice(i, i + 4);
    while (group.length < 4) group.push(0);
    const sizes = group.map((v) => (v <= 0xff ? 1 : v <= 0xffff ? 2 : v <= 0xffffff ? 3 : 4));
    let tag = 0;
    sizes.forEach((s, k) => {
      tag |= (s - 1) << (k * 2);
    });
    hooks.onGroup?.(tag, sizes);
    out.push(tag);
    group.forEach((v, k) => {
      for (let b = 0; b < sizes[k]!; b++) out.push((v >>> (b * 8)) & 0xff);
    });
  }
  return out;
}
