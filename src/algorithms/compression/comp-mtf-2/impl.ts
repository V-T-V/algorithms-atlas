// MTF v2 · 实现
export interface MtfHooks {
  onEncode?: (sym: number, idx: number) => void;
  onMoveToFront?: (table: number[]) => void;
}
export function mtfEncode(data: number[], alphabet: number[], hooks: MtfHooks = {}): number[] {
  const table = [...alphabet];
  const out: number[] = [];
  for (const sym of data) {
    const idx = table.indexOf(sym);
    out.push(idx);
    hooks.onEncode?.(sym, idx);
    if (idx > 0) {
      table.splice(idx, 1);
      table.unshift(sym);
      hooks.onMoveToFront?.([...table]);
    }
  }
  return out;
}
export function mtfDecode(idxes: number[], alphabet: number[]): number[] {
  const table = [...alphabet];
  const out: number[] = [];
  for (const idx of idxes) {
    const sym = table[idx]!;
    out.push(sym);
    if (idx > 0) {
      table.splice(idx, 1);
      table.unshift(sym);
    }
  }
  return out;
}
