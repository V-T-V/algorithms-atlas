export interface SpscHooks {
  onEnq?: (v: number, head: number, tail: number) => void;
  onDeq?: (v: number, head: number, tail: number) => void;
}
export function spscRing(
  cap: number,
  ops: Array<{ op: 'enq'; v: number } | { op: 'deq' }>,
  hooks: SpscHooks = {},
): { buf: number[]; head: number; tail: number } {
  const buf = new Array(cap).fill(undefined);
  let head = 0;
  let tail = 0;
  let count = 0;
  for (const o of ops) {
    if (o.op === 'enq') {
      if (count < cap) {
        buf[tail] = o.v;
        tail = (tail + 1) % cap;
        count++;
        hooks.onEnq?.(o.v, head, tail);
      }
    } else {
      if (count > 0) {
        const v = buf[head];
        head = (head + 1) % cap;
        count--;
        hooks.onDeq?.(v!, head, tail);
      }
    }
  }
  return { buf: buf.filter((x) => x !== undefined), head, tail };
}
