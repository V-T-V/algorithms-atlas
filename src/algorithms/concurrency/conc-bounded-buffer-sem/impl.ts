export interface BbsHooks {
  onProduce?: (v: number, size: number) => void;
  onConsume?: (v: number, size: number) => void;
  onBlock?: (who: string) => void;
}
export function boundedBufferSem(
  cap: number,
  ops: Array<{ op: 'p'; v: number } | { op: 'c' }>,
  hooks: BbsHooks = {},
): { buffer: number[]; log: string[] } {
  const buffer: number[] = [];
  const log: string[] = [];
  let empty = cap;
  let full = 0;
  for (const o of ops) {
    if (o.op === 'p') {
      if (empty === 0) {
        hooks.onBlock?.('producer');
        log.push('block p');
      }
      while (empty === 0) {}
      empty--;
      buffer.push(o.v);
      full++;
      hooks.onProduce?.(o.v, buffer.length);
    } else {
      if (full === 0) {
        hooks.onBlock?.('consumer');
        log.push('block c');
      }
      while (full === 0) {}
      full--;
      const v = buffer.shift()!;
      empty++;
      hooks.onConsume?.(v, buffer.length);
    }
  }
  return { buffer, log };
}
