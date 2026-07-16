export interface RiHooks {
  onReadEnter?: (tid: number, active: number) => void;
  onReadExit?: (tid: number, active: number) => void;
  onWriterWait?: (active: number) => void;
}
export function readIndicator(
  ops: Array<{ op: 're' | 'rx' | 'w'; tid: number }>,
  hooks: RiHooks = {},
): { active: number; writersBlocked: number } {
  let active = 0;
  let writersBlocked = 0;
  for (const o of ops) {
    if (o.op === 're') {
      active++;
      hooks.onReadEnter?.(o.tid, active);
    } else if (o.op === 'rx') {
      active = Math.max(0, active - 1);
      hooks.onReadExit?.(o.tid, active);
    } else {
      if (active > 0) {
        writersBlocked++;
        hooks.onWriterWait?.(active);
      }
    }
  }
  return { active, writersBlocked };
}
