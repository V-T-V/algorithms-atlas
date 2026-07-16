export interface DcHooks {
  onEmit?: (sym: number, dist: number) => void;
}
export function distanceCoding(data: number[], hooks: DcHooks = {}): number[] {
  const lastPos = new Map<number, number>();
  const out: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const s = data[i]!;
    if (lastPos.has(s)) {
      const d = i - lastPos.get(s)!;
      out.push(d);
      hooks.onEmit?.(s, d);
    } else {
      out.push(s);
      hooks.onEmit?.(s, 0);
    }
    lastPos.set(s, i);
  }
  return out;
}
