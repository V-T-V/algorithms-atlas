export interface MpscHooks {
  onEnq?: (tid: number, v: number) => void;
  onDeq?: (v: number) => void;
}
export function mpscQueue(
  ops: Array<{ op: 'enq'; tid: number; v: number } | { op: 'deq' }>,
  hooks: MpscHooks = {},
): number[] {
  const q: number[] = [];
  const out: number[] = [];
  for (const o of ops) {
    if (o.op === 'enq') {
      q.push(o.v);
      hooks.onEnq?.(o.tid, o.v);
    } else {
      const v = q.shift();
      if (v !== undefined) {
        out.push(v);
        hooks.onDeq?.(v);
      }
    }
  }
  return out;
}
