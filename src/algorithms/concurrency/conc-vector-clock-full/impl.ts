export interface VcHooks {
  onLocal?: (pid: number, clock: number[]) => void;
  onSend?: (from: number, to: number, msg: number[]) => void;
  onReceive?: (to: number, msg: number[]) => void;
}
export function vectorClockFull(
  n: number,
  events: Array<
    | { type: 'local'; pid: number }
    | { type: 'send'; from: number; to: number }
    | { type: 'recv'; to: number; msg: number[] }
  >,
  hooks: VcHooks = {},
): number[][] {
  const clocks: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (const e of events) {
    if (e.type === 'local') {
      clocks[e.pid]![e.pid]!++;
      hooks.onLocal?.(e.pid, clocks[e.pid]!);
    } else if (e.type === 'send') {
      clocks[e.from]![e.from]!++;
      hooks.onSend?.(e.from, e.to, clocks[e.from]!);
    } else {
      clocks[e.to]![e.to]!++;
      for (let i = 0; i < n; i++) clocks[e.to]![i] = Math.max(clocks[e.to]![i]!, e.msg[i]!);
      hooks.onReceive?.(e.to, clocks[e.to]!);
    }
  }
  return clocks;
}
