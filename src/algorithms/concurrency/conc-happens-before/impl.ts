export interface HbHooks {
  onEdge?: (a: number, b: number, kind: string) => void;
  onClose?: (added: number) => void;
}
export function happensBefore(
  events: number[],
  edges: Array<{ a: number; b: number; kind: string }>,
  hooks: HbHooks = {},
): boolean[][] {
  const n = events.length;
  const idx = new Map(events.map((e, i) => [e, i]));
  const reach: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
  for (const ed of edges) {
    const ia = idx.get(ed.a)!;
    const ib = idx.get(ed.b)!;
    reach[ia]![ib] = true;
    hooks.onEdge?.(ed.a, ed.b, ed.kind);
  }
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) if (reach[i]![k]! && reach[k]![j]!) reach[i]![j] = true;
  return reach;
}
