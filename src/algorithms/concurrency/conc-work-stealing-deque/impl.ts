export interface WsHooks {
  onPush?: (tid: number, v: number) => void;
  onPop?: (tid: number, v: number) => void;
  onSteal?: (from: number, to: number, v: number) => void;
}
export function workStealingDeque(
  workers: Array<{ deq: number[] }>,
  ops: Array<
    | { op: 'push'; tid: number; v: number }
    | { op: 'pop'; tid: number }
    | { op: 'steal'; from: number; to: number }
  >,
  hooks: WsHooks = {},
): void {
  for (const o of ops) {
    if (o.op === 'push') {
      workers[o.tid]!.deq.push(o.v);
      hooks.onPush?.(o.tid, o.v);
    } else if (o.op === 'pop') {
      const v = workers[o.tid]!.deq.pop();
      if (v !== undefined) hooks.onPop?.(o.tid, v);
    } else {
      const src = workers[o.from]!.deq;
      if (src.length) {
        const v = src.shift()!;
        hooks.onSteal?.(o.from, o.to, v);
        workers[o.to]!.deq.push(v);
      }
    }
  }
}
