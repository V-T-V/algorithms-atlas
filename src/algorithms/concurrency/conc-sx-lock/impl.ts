export interface SxHooks {
  onReadAcq?: (n: number) => void;
  onWriteAcq?: () => void;
  onRelease?: () => void;
}
export function sxLock(
  ops: Array<{ op: 'r' | 'w' }>,
  hooks: SxHooks = {},
): { readers: number; writer: boolean } {
  let readers = 0;
  let writer = false;
  for (const o of ops) {
    if (o.op === 'r') {
      while (writer) {}
      readers++;
      hooks.onReadAcq?.(readers);
      readers--;
      hooks.onRelease?.();
    } else {
      while (writer || readers > 0) {}
      writer = true;
      hooks.onWriteAcq?.();
      writer = false;
      hooks.onRelease?.();
    }
  }
  return { readers, writer };
}
