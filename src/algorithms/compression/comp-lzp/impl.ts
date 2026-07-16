export interface LzpHooks {
  onHit?: (pos: number, ctx: number) => void;
  onMiss?: (pos: number, byte: number) => void;
}
export function lzpEncode(data: number[], hooks: LzpHooks = {}): number[] {
  const table = new Map<number, number>();
  const out: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const ctx = i >= 2 ? data[i - 2]! * 256 + data[i - 1]! : 0;
    const prev = table.get(ctx);
    if (prev !== undefined && prev < i) {
      out.push(1, i - prev);
      hooks.onHit?.(i, ctx);
    } else {
      out.push(0, data[i]!);
      hooks.onMiss?.(i, data[i]!);
    }
    table.set(ctx, i);
  }
  return out;
}
