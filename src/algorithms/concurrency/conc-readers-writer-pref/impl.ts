export interface WpHooks {
  onRead?: (n: number) => void;
  onWrite?: () => void;
  onBlockRead?: () => void;
}
export function writerPrefRwLock(
  ops: Array<{ op: 'r' | 'w' }>,
  hooks: WpHooks = {},
): { readers: number; writer: boolean; waitingW: number } {
  let readers = 0;
  let writer = false;
  let waitingW = 0;
  for (const o of ops) {
    if (o.op === 'w') {
      waitingW++;
      while (writer || readers > 0) {}
      waitingW--;
      writer = true;
      hooks.onWrite?.();
      writer = false;
    } else {
      if (waitingW > 0) hooks.onBlockRead?.();
      while (waitingW > 0) {}
      readers++;
      hooks.onRead?.(readers);
      readers--;
    }
  }
  return { readers, writer, waitingW };
}
