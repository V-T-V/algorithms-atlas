export interface StripedHooks {
  onLock?: (seg: number) => void;
  onPut?: (key: number, seg: number) => void;
  onGet?: (key: number, found: boolean) => void;
}
export function stripedHashTable(
  ops: Array<{ op: 'put'; key: number; val: number } | { op: 'get'; key: number }>,
  segments: number,
  hooks: StripedHooks = {},
): Map<number, number> {
  const table = new Map<number, number>();
  for (const o of ops) {
    const seg = o.key % segments;
    hooks.onLock?.(seg);
    if (o.op === 'put') {
      table.set(o.key, o.val);
      hooks.onPut?.(o.key, seg);
    } else {
      hooks.onGet?.(o.key, table.has(o.key));
    }
  }
  return table;
}
